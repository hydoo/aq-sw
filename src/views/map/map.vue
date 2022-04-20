<template>
  <div id="map"></div>
</template>

<script lang="ts" setup>

import * as THREE from 'three'

import {onMounted} from "vue";

let container: HTMLElement;
const scene: THREE.Scene = new THREE.Scene();
let camera: any;
let renderer: any;
let light: any;
let cube: any;
const init = (): void => {

  setCamera()

  setRender();

  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({color: 0x00ff00})

  cube = new THREE.Mesh(geometry, material)
  scene.add(cube)

  render()

  animate()
}

const setCamera = (): void => {
  camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
  )

  camera.position.z = 10;

}
const setRender = (): void => {
  renderer = new THREE.WebGLRenderer()

  renderer.setSize(container.clientWidth, container.clientHeight)

  container.appendChild(renderer.domElement)
}

// 设置环境光
const setLight = (): void => {
  light = new THREE.AmbientLight(0xffffff)
  scene.add(light)

}


const render = (): void => {
  renderer.render(scene, camera)
}

const animate = (): void => {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  render()
}

onMounted(async () => {

  // container = <HTMLElement>document.getElementById('map');
  container = document.getElementById('map') as HTMLElement;

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
  border: 2px dashed #2d8cf0;
}

</style>