<script setup lang="ts">
import Camera from './code/Camera'

const conRef = ref()
let camera: Camera | null = null

onMounted(() => {
  camera = new Camera({
    container: conRef.value
  })
})

onUnmounted(() => {
  console.log(camera)

  if (camera) {
    camera.destroy()
  }
})
</script>

<template>
  <div id="container" ref="conRef"></div>
</template>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;

  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
}
</style>
