import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Geometry',
    meta: {
      title: '几何体'
    },
    children: [
      {
        path: '/building',
        name: 'Building',
        component: () => import('@/views/Geometry/Building.vue'),
        meta: {
          title: '房屋'
        }
      },
      {
        path: '/tank',
        name: 'Tank',
        component: () => import('@/views/Geometry/Tank.vue'),
        meta: {
          title: '坦克'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'Model',
    meta: {
      title: '模型'
    },
    children: [
      {
        path: '/obj',
        name: 'Obj',
        component: () => import('@/views/Model/Obj.vue'),
        meta: {
          title: 'OBJ'
        }
      },
      {
        path: '/gltf',
        name: 'Gltf',
        component: () => import('@/views/Model/Gltf.vue'),
        meta: {
          title: 'GLTF'
        }
      }
    ]
  }
]
