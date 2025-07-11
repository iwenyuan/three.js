<script setup lang="ts">
import { routes } from '@/router/router'
import type { RouteRecordRaw } from 'vue-router'
const router = useRouter()

const handleClick = (item: RouteRecordRaw) => {
  console.log(item)

  router.push(item.path)
}

onMounted(() => {
  handleClick(routes[0].children![0])
})
</script>

<template>
  <a-layout class="home-view">
    <a-layout-sider theme="dark" collapsible>
      <a-menu
        accordion
        theme="dark"
        :default-open-keys="['/learn-submenu']"
        :default-selected-keys="['/camera']"
      >
        <template v-for="item in routes" :key="item.path">
          <template v-if="item.children">
            <a-sub-menu :title="item.meta?.title" :key="item.path + '-submenu'">
              <a-menu-item v-for="i in item.children" :key="i.path" @click="handleClick(i)">
                {{ i.meta?.title }}
              </a-menu-item>
            </a-sub-menu>
          </template>
          <template v-else>
            <a-menu-item :key="item.path + '-menuitem'">
              {{ item.meta?.title }}
            </a-menu-item>
          </template>
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
