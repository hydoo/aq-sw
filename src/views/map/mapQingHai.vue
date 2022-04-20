<template>
  <span id="topic">西宁市地图</span>
  <div id="mapQingHai"></div>
  <div id="tooltip"></div>

</template>

<script lang="ts" setup>
import * as THREE from 'three';
import * as d3 from 'd3';
import {onMounted} from "vue";
import {OrbitControls} from 'three-orbitcontrols-ts';
// import {MapControls} from "three/examples/jsm/controls/OrbitControls";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

// console.log('本Threejs版本号为：', window.__THREE__)


let mapCity: string = 'XN';
let mapCityCenter: any = {
  'XN': [
    101.532112,
    36.573949
  ],
  'CD': [
    104.080989,
    30.657689
  ],
  'XA': [
    108.959903,
    34.26927
  ],
}

// 墨卡托投影转换
const projection: any = d3
    .geoMercator()
    .center(mapCityCenter[mapCity])
    .scale(4000)
    .translate([0, 0]);

let praColor = 'rgba(5,206,147,.6)';
let subColor = 'rgba(1,126,100,0.6)';
let pickColor = 'rgba(234,134,13,0.6)'

let container: HTMLElement;
const scene = new THREE.Scene();

// var axisHelper = new THREE.AxesHelper(50);
// scene.add(axisHelper);

let group = new THREE.Group()

let objLoader = new OBJLoader()
let mtlLoader = new MTLLoader()
let objRatio = 1 / 100

mtlLoader.load('src/assets/obj/t.mtl', function (m) {
  objLoader.setMaterials(m)

  objLoader.load('src/assets/obj/t.obj', function (obj) {

    let tower = obj.children[0];
    tower.name = 'Tower';

    tower.scale.set(objRatio, objRatio, objRatio);

    const [x, y] = projection([101.780368, 36.609787]);

    tower.position.set(x, y - 20, 0);
    // tower.rotateX(Math.PI / 2)

    tower.castShadow = true;


    // tower.material.color.set(0xff0000)

    group.add(tower)
    scene.add(group)
  })

})


let camera: any;
let renderer: any;
let light: any;

const init = (): void => {

  setCamera()

  setRender();

  setLight();

  // 轨道控制器
  setOrbitControl();

  setRayCaster();

  loadMapData();

  render()

  animate()

  // setRooms()
}

// 增加机房标志
const setRooms = (): void => {
  var room1 = new THREE.ConeGeometry(2, 10, 20);
  room1.type = 'room'
  room1.name = 'room1'

// 几何体xyz三个方向都放大2倍
  room1.scale(1, 1, 1);
// 几何体沿着x轴平移50
  room1.translate(0, 5, 0);
// 几何体绕着x轴旋转45度
  room1.rotateX(Math.PI / 2);

  var room1_material = new THREE.MeshBasicMaterial({color: 0xff0f00});
  let room1_mesh = new THREE.Mesh(room1, room1_material);
  room1_mesh.castShadow = true;

  scene.add(room1_mesh);


  var room2 = new THREE.ConeGeometry(2, 10, 20);
  room2.type = 'room'
  room2.name = 'room2'

// 几何体xyz三个方向都放大2倍
  room2.scale(1, 1, 1);
// 几何体沿着x轴平移50
  room2.translate(10, 5, 0);
// 几何体绕着x轴旋转45度
  room2.rotateX(Math.PI / 2);

  var room2_material = new THREE.MeshBasicMaterial({color: 0xf00ff0});

  scene.add(new THREE.Mesh(room2, room2_material));


  var room3 = new THREE.ConeGeometry(2, 10, 20);
  room3.type = 'room'
  room3.name = 'room3'
// 几何体xyz三个方向都放大2倍
//   room3.scale(1, 1, 1);
// 几何体沿着x轴平移50
  room3.translate(7, 5, -20);
// 几何体绕着x轴旋转45度
  room3.rotateX(Math.PI / 2);

  var room3_material = new THREE.MeshBasicMaterial({color: 0x555555});

  scene.add(new THREE.Mesh(room3, room3_material));


  // 连线
  var geometry = new THREE.BufferGeometry(); //声明一个几何体对象Geometry
  var p1 = new THREE.Vector3(0, 0, 0);
  var p2 = new THREE.Vector3(4, 10, 20);
  var p3 = new THREE.Vector3(7, 20, 0);
// 三维二次贝赛尔曲线
  var curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);


//   //getPoints是基类Curve的方法，返回一个vector3对象作为元素组成的数组
  var points = curve.getPoints(100); //分段数100，返回101个顶点
// // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
  geometry.setFromPoints(points);
//材质对象
  var material = new THREE.LineBasicMaterial({
    color: 0xEE0000
  });
//线条模型对象
  var line = new THREE.Line(geometry, material);
  scene.add(line); //线条对象添加到场景中
}

const setCamera = (): void => {
  camera = new THREE.PerspectiveCamera(
      100,
      container.clientWidth / container.clientHeight,
      .1,
      1000
  )

  camera.position.set(0, 0, 50)
  // camera.position.set(scene.position)
  // camera.lookAt(scene.position)

}

const setRender = (): void => {
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(container.clientWidth, container.clientHeight)
  // 设置背景颜色
  renderer.setClearColor(0xEEEEEE, 0)

  renderer.shadowMap.enabled = true

  renderer.sortObjects = false;
  container.appendChild(renderer.domElement)
}

// 设置环境光
let spotLight: any;
const setLight = (): void => {
  light = new THREE.AmbientLight(0xCCCCCC)
  scene.add(light)


  let spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-60, 40, -15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
  spotLight.shadow.camera.far = 130;
  spotLight.shadow.camera.near = 40;
  scene.add(spotLight);

}

let controls: any;
const setOrbitControl = (): void => {

  controls = new OrbitControls(camera, renderer.domElement);


  // controls = new MapControls(camera, renderer.domElement);

  controls.enableDamping = true;
  controls.dampingFactor = .5;

  controls.screenSpacePanning = false;

  controls.minDistance = 10;
  controls.maxDistance = 100;

  // controls.minPolarAngle = Math.PI / 2;
  // controls.maxPolarAngle = Math.PI / 2;
  controls.autoRotate = false;

  // controls.maxAzimuthAngle = Math.PI / 2;

}

let rayCaster: THREE.Raycaster;
let mouse: { x: number, y: number };
let tooltip: any | null;

const setRayCaster = (): void => {
  rayCaster = new THREE.Raycaster()

  mouse = new THREE.Vector2()

  tooltip = document.getElementById('tooltip')
  const onMouseMove = (event: any): void => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;

    tooltip.style.left = event.clientX + 2 + 'px';
    tooltip.style.top = event.clientY + 2 + 'px';

    showTip()
  }

  self.addEventListener('mousemove', onMouseMove, false);

}

const showTip = (): void => {
  if (lastPick) {
    const properties = lastPick.object.parent.properties

    tooltip.textContent = properties.name

    tooltip.style.visibility = 'visible'
  } else {
    tooltip.style.visibility = 'hidden'
  }

}

const render = (): void => {

  controls.update();

  renderer.render(scene, camera)
}
let intersects: any | null;
let lastPick: any | null;
let pickRoom: any | null;

var gap = 0;

const animate = (): void => {
  gap += .01;

  // camera.position.x = -10 + (-10 * Math.sin(gap))
  // camera.position.y = -40 + (-40 * Math.sin(gap))
  camera.position.z = 0 + (60 * Math.abs(Math.cos(gap)))


  requestAnimationFrame(animate)

  rayCaster.setFromCamera(mouse, camera)

  intersects = rayCaster.intersectObjects(scene.children, true);

  // for ( var i = 0; i < intersects.length; i++ ) {
  //
  //   intersects[ i ].object.material.color.set( 0xff0000 );
  //
  // }

  // 恢复上一次清空的
  if (lastPick) {
    lastPick.object.material[0].color.set(praColor)
    lastPick.object.material[1].color.set(subColor)
  }
  lastPick = intersects.find(
      item => item.object?.material && item.object?.material?.length === 2
  )
  pickRoom = intersects.find(
      item => item.object.geometry.type == 'ConeGeometry'
  )


  if (lastPick) {
    lastPick.object.material[0].color.set(pickColor)
    lastPick.object.material[1].color.set(pickColor)
  }

  render()
}


// 加载地图数据
const loadMapData = (): void => {
  const loader = new THREE.FileLoader()
  loader.load(`src/data/${mapCity}1.json`, data => {
    generateGeometry(data.toString())
  })
}

let map: any;
const generateGeometry = (geoData: string) => {
  let jsonData = JSON.parse(geoData);
  // 初始化一个地图对象
  map = new THREE.Object3D()

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
          let [x, y] = projection(polygon[i])
          if (i === '0') {
            shape.moveTo(x, -y - 20);
          } else {
            shape.lineTo(x, -y - 20);
          }

          vertices.push(x);
          vertices.push(-y - 20);
          vertices.push(-1);
        }

        // 绘制拉伸体
        let geometry = new THREE.ExtrudeGeometry(
            shape,
            {
              depth: -2,
              bevelEnabled: false,
            }
        )
        let material = new THREE.MeshBasicMaterial({
          color: praColor,
          transparent: true,
          opacity: .5,
        })
        let material1 = new THREE.MeshBasicMaterial({
          color: subColor,
          transparent: true,
          opacity: .5,
        });

        // 绘制线
        let lineGeometry: THREE.BufferGeometry = new THREE.BufferGeometry();
        lineGeometry.attributes.position = new THREE.BufferAttribute(new Float32Array(vertices), 3);

        let lineMaterial = new THREE.LineBasicMaterial({
          color: '#FFF',
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
      let [x, y] = projection(elem.properties.contorid);
      province.properties._centroid = [x, y];
    }

    map.add(province);
  })

  scene.add(map);
}

function mouseClick(e: any | null) {
  e.preventDefault()

  let rayCaster = new THREE.Raycaster()
  let mouse = new THREE.Vector2()

  mouse.x = (e.clientX / innerWidth) * 2 - 1;
  mouse.y = (e.clientY / innerHeight) * 2 + 1;

  rayCaster.setFromCamera(mouse, camera)

  let intersects = rayCaster.intersectObjects(scene.children, true)

  // let MName = intersects[0].object.name;
  // if (MName == 'Tower') {
  //   alert()
  // }

  console.info('intersects ~ ', intersects)
  for (let o of intersects) {
    console.info(o.object.name)

    // if (o?.object?.type == 'Mesh') {
    //
    //
    // }


  }

}

onMounted(async () => {

  // container = <HTMLElement>document.getElementById('map');
  container = document.getElementById('mapQingHai') as HTMLElement;

  init()

  addEventListener('click', mouseClick, false)

})


</script>

<style lang="less" scoped>

#topic {
  z-index: 100;
  display: inline-block;
  padding: 6px 15px;
  background-color: transparent;
  color: #FFF;
  letter-spacing: 3px;
  text-indent: 3px;
  position: absolute;
  top: 60px;
  left: calc(50% - 100px);

}

#mapQingHai {
  position: absolute;
  top: 50px;
  left: 50px;
  display: inline-block;
  width: calc(100% - 100px);
  height: calc(100% - 100px);

}

#tooltip {
  z-index: 2;
  position: absolute;
  visibility: hidden;
  background: rgba(100, 100, 100, .4);
  padding: 6px 10px;
  border-radius: 3px;
  color: #FFF;
}

</style>