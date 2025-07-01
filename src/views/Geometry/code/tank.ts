import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'

class Tank extends ThreeBase {
  private tank!: THREE.Object3D
  private turretPivot!: THREE.Object3D
  private targetBob!: THREE.Object3D
  private targetMesh!: THREE.Mesh
  private targetMaterial!: THREE.MeshPhongMaterial
  private curve!: THREE.SplineCurve
  private targetPosition2 = new THREE.Vector3()
  private tankPosition = new THREE.Vector2()
  private tankTarget = new THREE.Vector2()
  private time = 0

  constructor(config: ThreeBaseConfig) {
    super(config)
    // 不要在构造函数里操作camera/scene
  }

  protected override onReady(): void {
    // 初始化相机和场景
    this.getCamera().position.set(50, 50, 50)
    this.getScene().background = new THREE.Color(0x000000)

    this.addLight()
    this.initTank()
  }

  protected override onRender(): void {
    this.updateTankAnimation(this.time * 1000)
  }

  private addLight(): void {
    const light1 = new THREE.DirectionalLight(0xffffff, 1)
    light1.position.set(0, 20, 0)
    const light2 = new THREE.DirectionalLight(0xffffff, 1)
    light2.position.set(1, 2, 4)
    this.getScene().add(light1)
    this.getScene().add(light2)
  }

  private initTank(): void {
    this.tank = new THREE.Object3D()
    this.getScene().add(this.tank)

    // 底盘
    const carWidth = 4,
      carHeight = 1,
      carLength = 8
    const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa })
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial)
    bodyMesh.position.y = 1.4
    this.tank.add(bodyMesh)

    // 轮子
    const wheelRadius = 1,
      wheelThickness = 0.5,
      wheelSegments = 36
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      wheelThickness,
      wheelSegments
    )
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 })
    const wheelPositions: [number, number, number][] = [
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
    const domeMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa })
    const domeMesh = new THREE.Mesh(domeGeometry, domeMaterial)
    domeMesh.position.y = 0.5
    bodyMesh.add(domeMesh)

    // 炮管
    const turretGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32)
    const turretMaterial = new THREE.MeshPhongMaterial({ color: 0x6688aa })
    const turretMesh = new THREE.Mesh(turretGeometry, turretMaterial)
    turretMesh.position.z = 2.5
    turretMesh.rotation.x = Math.PI * 0.5

    this.turretPivot = new THREE.Object3D()
    this.turretPivot.position.y = 1.5
    this.turretPivot.add(turretMesh)
    bodyMesh.add(this.turretPivot)

    // 目标
    const targetGeometry = new THREE.SphereGeometry(0.5, 36, 36)
    this.targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    this.targetMesh = new THREE.Mesh(targetGeometry, this.targetMaterial)

    const targetElevation = new THREE.Object3D()
    this.targetBob = new THREE.Object3D()
    this.getScene().add(targetElevation)
    targetElevation.position.y = 8
    targetElevation.position.z = carLength * 2
    targetElevation.add(this.targetBob)
    this.targetBob.add(this.targetMesh)

    this.turretPivot.lookAt(this.targetBob.position)

    // 路径
    this.curve = new THREE.SplineCurve([
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
    const points = this.curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
    const splineObject = new THREE.Line(geometry, material)
    splineObject.rotation.x = Math.PI * 0.5
    splineObject.position.y = 0.05
    this.getScene().add(splineObject)

    this.updateTankAnimation(0)
  }

  private updateTankAnimation(t: number): void {
    this.time = t * 0.001

    // 上下移动目标
    this.targetBob.position.y = Math.sin(this.time * 2) * 4
    this.targetMaterial.emissive.setHSL((this.time * 10) % 1, 1, 0.25)
    this.targetMaterial.color.setHSL((this.time * 10) % 1, 1, 0.25)

    // 获取目标全局坐标
    this.targetMesh.getWorldPosition(this.targetPosition2)
    // 炮台瞄准目标
    this.turretPivot.lookAt(this.targetPosition2)

    // 根据路线移动坦克
    const tankTime = this.time * 0.05
    this.curve.getPointAt(tankTime % 1, this.tankPosition)
    this.curve.getPointAt((tankTime + 0.01) % 1, this.tankTarget)
    this.tank.position.set(this.tankPosition.x, 0, this.tankPosition.y)
    this.tank.lookAt(this.tankTarget.x, 0, this.tankTarget.y)
  }
}

export default Tank
