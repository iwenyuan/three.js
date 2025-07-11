<script setup lang="ts">
import RandomTerrain from './code/RandomTerrain'

const conRef = ref()
let randomTerrain: RandomTerrain | null = null

onMounted(() => {
  randomTerrain = new RandomTerrain({
    container: conRef.value
  })
})

onUnmounted(() => {
  if (randomTerrain) {
    randomTerrain.destroy()
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
