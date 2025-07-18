import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/learn',
    name: 'Learn',
    meta: {
      title: '学习'
    },
    children: [
      {
        path: '/camera',
        name: 'Camera',
        component: () => import('@/views/Learn/Camera.vue'),
        meta: {
          title: '相机'
        }
      },
      {
        path: '/buffet-geometry',
        name: 'BufferGeometry',
        component: () => import('@/views/Learn/Geometry.vue'),
        meta: {
          title: '几何体'
        }
      },
      {
        path: '/random-terrain',
        name: 'RandomTerrain',
        component: () => import('@/views/Learn/RandomTerrain.vue'),
        meta: {
          title: '随机地形'
        }
      },
      {
        path: '/material',
        name: 'Material',
        component: () => import('@/views/Learn/Material.vue'),
        meta: {
          title: '材质'
        }
      },
      {
        path: '/tunnel',
        name: 'Tunnel',
        component: () => import('@/views/Learn/Tunnel.vue'),
        meta: {
          title: '隧道'
        }
      }
    ]
  },
  {
    path: '/geometry',
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
    path: '/model',
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
