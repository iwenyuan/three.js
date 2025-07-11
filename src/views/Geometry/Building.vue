<script setup lang="ts">
import Building from './code/Building'

const conRef = ref()
let three: Building | null = null

onMounted(() => {
  three = new Building({
    container: conRef.value
  })
})

onUnmounted(() => {
  if (three) {
    three.destroy()
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
