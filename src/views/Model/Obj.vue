<script setup lang="ts">
import Obj from './code/Obj'

const conRef = ref()
let three: Obj | null = null

onMounted(() => {
  three = new Obj({
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
