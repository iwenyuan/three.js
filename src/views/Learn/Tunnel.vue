<script setup lang="ts">
import Tunnel from './code/Tunnel'

const conRef = ref()
let tunnel: Tunnel | null = null

onMounted(() => {
  tunnel = new Tunnel({
    container: conRef.value,
    enableControls: false
  })
})

onUnmounted(() => {
  if (tunnel) {
    tunnel.destroy()
    tunnel = null
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
