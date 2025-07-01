<script setup lang="ts">
import Tank from './code/tank'

const init = () => {
  new Tank({
    container: '#container'
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div id="container"></div>
</template>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100vh; /* 使用视口高度 */
  position: relative;
  overflow: hidden;

  canvas {
    width: 100% !important;
    height: 100% !important;
    display: block;
  }
}
</style>
