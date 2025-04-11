<script setup lang="ts">
import Building from './code/building'

const conRef = ref()
let three: Building | null = null

onMounted(() => {
  three = new Building({
    container: conRef.value
  })
})

onBeforeMount(() => {
  if (three) {
    three.destroy()
  }
})
</script>

<template>
  <div id="container" ref="conRef">
    <!-- <canvas ref="conRef"></canvas> -->
  </div>
</template>

<style lang="scss" scoped>
#container {
  width: 100%;
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>
