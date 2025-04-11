<script setup lang="ts">
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
        <template v-for="item in routes" :key="item.path">
          <a-sub-menu v-if="item.children" :title="item.meta.title">
            <a-menu-item v-for="i in item.children" :key="i.path" @click="handleClick(i)">
              {{ i.meta.title }}
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-else :key="item.path" @click="handleClick(item)">
            {{ item.meta.title }}
          </a-menu-item>
        </template>
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
