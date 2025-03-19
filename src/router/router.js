export const routes = [
  {
    path: '/geometry',
    name: 'Geometry',
    component: () => import('@/views/Geometry.vue'),
    meta: {
      title: '几何体'
    }
  }
]
