<script setup>
import { routes } from '@/router/router'
const router = useRouter()
const handleClick = (item) => {
  router.push(item.path)
}
</script>

<template>
  <a-layout class="home-view">
    <a-layout-sider theme="dark" collapsible>
      <a-menu theme="dark">
        <a-menu-item v-for="item in routes" :key="item.path" @click="handleClick(item)">
          {{ item.meta.title }}
        </a-menu-item>
      </a-menu>
      <template #trigger="{ collapsed }">
        <IconCaretRight v-if="collapsed" color="#fff"></IconCaretRight>
        <IconCaretLeft v-else color="#fff"></IconCaretLeft>
      </template>
    </a-layout-sider>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss" scoped>
.home-view {
  height: 100vh;
}
</style>
