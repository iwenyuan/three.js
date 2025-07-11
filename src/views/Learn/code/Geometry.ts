import ThreeBase, { type ThreeBaseConfig } from '@/core/ThreeBase'
import * as THREE from 'three'

class Geometry extends ThreeBase {
  constructor(config: ThreeBaseConfig) {
    super(config)

    this.reset()
    this.initBufferGeometry()
  }

  protected override onReady(): void {}

  protected override onRender(): void {}

  private reset(): void {
    this.scene!.background = new THREE.Color('#000')
    this.camera!.position.set(50, 50, 100)

    this.controls!.target = new THREE.Vector3(50, 50, 0)
    this.controls!.update()
  }

  private initBufferGeometry(): void {
    // 非索引模式
    // this.addBufferGeometry1()
    // 索引模式
    // this.addBufferGeometry2()
    // 平面缓冲几何体
    // this.addBufferGeometry3()
    // 点
    // this.addPointsGeometry()
    // 线
    // this.addLineGeometry()
    // 网格
    this.addMeshGeometry()
  }

  private addBufferGeometry1(): void {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 100, 100, 0
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene!.add(mesh)
  }

  private addBufferGeometry2(): void {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 100, 100, 0
    ])
    const attribute = new THREE.BufferAttribute(vertices, 3)
    geometry.attributes.position = attribute

    const indices = new Uint16Array([0, 1, 2, 3, 4, 5])
    geometry.index = new THREE.BufferAttribute(indices, 1)

    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene!.add(mesh)
  }

  private addBufferGeometry3(): void {
    const geometry = new THREE.PlaneGeometry(100, 100)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene!.add(mesh)
  }

  private addPointsGeometry(): void {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0, 100, 0, 0, 0, 100, 0, 0, 100, 0, 100, 0, 0, 100, 100, 0
    ])
    // const attribute = new THREE.BufferAttribute(vertices, 3)
    // geometry.attributes.position = attribute
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.PointsMaterial({ color: new THREE.Color('orange'), size: 10 })
    const points = new THREE.Points(geometry, material)
    this.scene!.add(points)
  }

  private addLineGeometry(): void {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0, 100, 0, 0, 0, 100, 0, 100, 100, 0])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color('orange'),
      linewidth: 10
    })
    // const line = new THREE.Line(geometry, material)
    // const line = new THREE.LineSegments(geometry, material)
    const line = new THREE.LineLoop(geometry, material)
    this.scene!.add(line)
  }

  private addMeshGeometry(): void {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0, 100, 0, 0, 100, 100, 0, 0, 100, 0])
    // geometry.attributes.position = new THREE.BufferAttribute(vertices, 3)
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const indexes = new Uint16Array([0, 1, 2, 0, 2, 3])
    // geometry.index = new THREE.BufferAttribute(indexes, 1)
    geometry.setIndex(new THREE.BufferAttribute(indexes, 1))
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      wireframe: false,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene!.add(mesh)
  }
}

export default Geometry
