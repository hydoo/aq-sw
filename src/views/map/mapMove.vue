<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>
import {onMounted} from "vue";
import * as THREE from "three";
import {Clock} from "three";
import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import * as d3 from "d3";

// 墨卡托投影转换
const geoMercator: any = d3
    .geoMercator()
    .center([101.532112, 36.573949])
    .scale(4000)
    .translate([0, 0]);

const praColor = 'rgba(5,206,147,.6)';
const subColor = 'rgba(1,126,100,0.6)';

function init() {
  const mapContainer = document.getElementById('map') as HTMLElement;
  const mapWidth = mapContainer.clientWidth;
  const mapHeight = mapContainer.clientHeight;

  // 创建场景
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060606);

  // 设置灯光
  const light = new THREE.AmbientLight(0x0c0c0c);

  const spotLight1 = new THREE.SpotLight(0xffffff);
  spotLight1.position.set(-400, -400, -400);

  const spotLight2 = new THREE.SpotLight(0xffffff);
  spotLight2.position.set(400, 800, 400);

  scene.add(light);
  scene.add(spotLight1);
  scene.add(spotLight2);

  // 设置相机
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1000);
  camera.position.set(0, 50, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 设置渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(innerWidth, innerHeight);
  mapContainer.appendChild(renderer.domElement);

  // 轨道控制器
  const controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;// 启用动态阻尼时需要一个动画循环
  controls.dampingFactor = 0.30;

  controls.screenSpacePanning = false;// 若为 true 则可以平移

  controls.maxDistance = 400;
  controls.minDistance = 100;

  controls.maxPolarAngle = Math.PI / 2.2;
  controls.autoRotate = false;

  // 加载地图模型
  const loader = new THREE.FileLoader()
  loader.load(`src/data/XN1.json`, data => {
    let jsonData = JSON.parse(data.toString());
    // 初始化一个地图对象
    const map = new THREE.Object3D()

    let province: any;
    let coordinates: any;
    let shape: THREE.Shape;
    let vertices: any[] = []
    jsonData.features.forEach((elem: any) => {
      // 每个的 坐标 数组
      coordinates = elem.geometry.coordinates
      // 循环坐标数组
      coordinates.forEach((multiPolygon: any) => {
        multiPolygon.forEach((polygon: any) => {
          shape = new THREE.Shape();
          vertices.length = 0;
          for (let i in polygon) {
            let [x, y] = geoMercator(polygon[i])
            if (i === '0') {
              shape.moveTo(x, -y);
            } else {
              shape.lineTo(x, -y);
            }

            vertices.push(x);
            vertices.push(-y);
            vertices.push(-2);
          }

          // 绘制拉伸体
          let geometry = new THREE.ExtrudeGeometry(
              shape,
              {
                depth: -5,
                bevelEnabled: false,
              }
          )
          let material = new THREE.MeshBasicMaterial({
            color: praColor,
            transparent: true,
            opacity: 0.5,
          })
          let material1 = new THREE.MeshBasicMaterial({
            color: subColor,
            transparent: true,
            opacity: 0.5,
          });

          // 绘制线
          let lineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
          lineGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);

          let lineMaterial = new THREE.LineBasicMaterial({
            color: 'grey',
            linewidth: 1,
            linecap: 'round',
            linejoin: 'round'
          })

          // 定义一个省份3D对象
          province = new THREE.Object3D();
          province.add(new THREE.Mesh(geometry, [material, material1]))
          province.add(new THREE.Line(lineGeometry, lineMaterial))
        })
      })

      province.properties = elem.properties;
      if (elem.properties.contorid) {
        let [x, y] = geoMercator(elem.properties.contorid);
        province.properties._centroid = [x, y];
      }

      map.add(province);
    })
    scene.add(map);
  });

  animate()

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    update();
  }

  let clock = new Clock();

  function update() {
    // stats.update();

    controls.update(clock.getDelta());
  }

}


onMounted(async () => {

  init()

})


</script>

<style lang="less" scoped>
#map {
  position: absolute;
  top: 50px;
  left: 50px;
  display: inline-block;
  width: calc(100% - 100px);
  height: calc(100% - 100px);

}


</style>