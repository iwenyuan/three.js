<script setup lang="ts">
import Material from './code/Material'

const conRef = ref()
let material: Material | null = null

onMounted(() => {
  material = new Material({
    container: conRef.value
  })
})

onUnmounted(() => {
  if (material) {
    material.destroy()
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
