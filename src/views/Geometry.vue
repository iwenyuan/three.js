<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
const conRef = ref()

let renderer,
  camera,
  scene,
  controls,
  time = 0
let tank, targetBob, targetMaterial, targetMesh, turretPivot, curve
let animationFrameId = null

const init = () => {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  camera = makeCamera()
  camera.position.set(50, 50, 50)
  scene.add(camera)

  renderer = new THREE.WebGLRenderer({
    canvas: conRef.value,
    antialias: true, // 抗锯齿
    alpha: true // 背景色
  })

  // 辅助坐标系
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  resizeRendererToDisplaySize()
  controls = new OrbitControls(camera, renderer.domElement)
  window.addEventListener('resize', resizeRendererToDisplaySize)

  // 平行光
  const light1 = new THREE.DirectionalLight(0xffffff, 1)
  light1.position.set(0, 20, 0)
  scene.add(light1)

  const light2 = new THREE.DirectionalLight(0xffffff, 1)
  light2.position.set(1, 2, 4)
  scene.add(light2)

  const groundGeometry = new THREE.PlaneGeometry(50, 50)
  // Phong网格材质:具有镜面高光的光泽表面的材质
  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0xcc8866,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)

  initTank()

  render(0)
}

const initTank = () => {
  tank = new THREE.Object3D()
  scene.add(tank)

  // 地盘
  const carWidth = 4
  const carHeight = 1
  const carLength = 8
  const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
  const bodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x6688aa
  })
  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
  bodyMesh.position.y = 1.4
  tank.add(bodyMesh)

  // 轮子
  const wheelRadius = 1
  const wheelThickness = 0.5
  const wheelSegments = 36
  const wheelGeometry = new THREE.CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelThickness,
    wheelSegments
  )
  const wheelMaterial = new THREE.MeshPhongMaterial({
    color: 0x888888
  })
  const wheelPositions = [
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3]
  ]
  wheelPositions.forEach((item) => {
    const wheelMesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheelMesh.position.set(...item)
    wheelMesh.rotation.z = Math.PI * 0.5
    bodyMesh.add(wheelMesh)
  })

  // 炮台
  const domeGeometry = new THREE.SphereGeometry(2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2)
  const domeMaterial = new THREE.MeshPhongMaterial({
    color: 0x6688aa
  })
  const domeMesh = new THREE.Mesh(domeGeometry, domeMaterial)
  domeMesh.position.y = 0.5
  bodyMesh.add(domeMesh)

  // 炮管
  const turretGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32)
  const turretMaterial = new THREE.MeshPhongMaterial({
    color: 0x6688aa
  })
  const turretMesh = new THREE.Mesh(turretGeometry, turretMaterial)
  turretMesh.position.z = 2.5
  turretMesh.rotation.x = Math.PI * 0.5

  turretPivot = new THREE.Object3D()
  turretPivot.position.y = 1.5
  turretPivot.add(turretMesh)
  bodyMesh.add(turretPivot)

  // 目标
  const targetGeometry = new THREE.SphereGeometry(0.5, 36, 36)
  targetMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00
  })
  targetMesh = new THREE.Mesh(targetGeometry, targetMaterial)

  const targetElevation = new THREE.Object3D()
  targetBob = new THREE.Object3D()
  scene.add(targetElevation)

  targetElevation.position.y = 8
  targetElevation.position.z = carLength * 2
  targetElevation.add(targetBob)
  targetBob.add(targetMesh)

  const targetPosition = new THREE.Vector3()
  targetBob.getWorldPosition(targetPosition)

  turretPivot.lookAt(targetBob.position)

  // 移动路径 二维样条曲线
  curve = new THREE.SplineCurve([
    new THREE.Vector2(-10, 20),
    new THREE.Vector2(-5, 5),
    new THREE.Vector2(0, 0),
    new THREE.Vector2(5, -5),
    new THREE.Vector2(10, 0),
    new THREE.Vector2(5, 10),
    new THREE.Vector2(-5, 10),
    new THREE.Vector2(-10, -10),
    new THREE.Vector2(-15, -8),
    new THREE.Vector2(-10, 20)
  ])
  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({
    color: 0xff0000
  })
  const splineObject = new THREE.Line(geometry, material)
  splineObject.rotation.x = Math.PI * 0.5
  splineObject.position.y = 0.05
  scene.add(splineObject)
}

const targetPosition2 = new THREE.Vector3()
const tankPosition = new THREE.Vector2()
const tankTarget = new THREE.Vector2()
const render = (t) => {
  time = t * 0.001

  // 上下移动目标
  targetBob.position.y = Math.sin(time * 2) * 4
  targetMaterial.emissive.setHSL((time * 10) % 1, 1, 0.25)
  targetMaterial.color.setHSL((time * 10) % 1, 1, 0.25)

  // 获取目标全局坐标
  targetMesh.getWorldPosition(targetPosition2)
  // 炮台瞄准目标
  turretPivot.lookAt(targetPosition2)

  // 根据路线移动坦克
  const tankTime = time * 0.05
  curve.getPointAt(tankTime % 1, tankPosition)
  // 获取路径 坦克前一点坐标，用于坦克头向前
  curve.getPointAt((tankTime + 0.01) % 1, tankTarget)
  tank.position.set(tankPosition.x, 0, tankPosition.y)
  tank.lookAt(tankTarget.x, 0, tankTarget.y)

  controls.update()
  // 加载渲染器
  renderer.render(scene, camera)
  // 开始渲染
  animationFrameId = requestAnimationFrame(render)
}

// 相机
const makeCamera = (fov = 40) => {
  const aspect = 2 // canvas的宽高比
  const near = 0.1 // 近平面
  const far = 1000 // 远平面
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
  return camera
}

const resizeRendererToDisplaySize = () => {
  const container = document.getElementById('container')
  const width = container.clientWidth
  const height = container.clientHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        object.material.dispose()
      }
    })
  }
  window.removeEventListener('resize', resizeRendererToDisplaySize)
})
</script>

<template>
  <div id="container">
    <canvas ref="conRef"></canvas>
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
