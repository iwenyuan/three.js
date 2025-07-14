import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'
import { createNoise2D, type NoiseFunction2D } from 'simplex-noise'

class RandomTerrain extends ThreeBase {
  private positions!: THREE.BufferAttribute
  private noise: NoiseFunction2D = createNoise2D()
  constructor(config: ThreeBaseConfig) {
    super(config)
    this.createRandomTerrain()
  }

  protected override onReady(): void {
    this.scene!.background = new THREE.Color('#000')
    this.camera!.position.set(100, 100, 100)
  }

  protected override onRender(): void {
    this.positions && this.updatePositions()
  }

  private createRandomTerrain(): void {
    const geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100)
    this.positions = geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < this.positions.count; i++) {
      const x = this.positions.getX(i)
      const y = this.positions.getY(i)
      const z = this.noise(x / 300, y / 300)
      this.positions.setZ(i, z * 50)
    }
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#0085fe'),
      wireframe: true
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    this.scene!.add(mesh)
  }

  private updatePositions(): void {
    for (let i = 0; i < this.positions.count; i++) {
      const x = this.positions.getX(i)
      const y = this.positions.getY(i)
      const z = this.noise(x / 300, y / 300) * 50
      const sinNum = Math.sin(Date.now() * 0.002 + x * 0.05) * 10
      this.positions.setZ(i, z + sinNum)
    }
    // 告诉 GPU 顶点变了，需要重新渲染
    this.positions.needsUpdate = true
  }
}

export default RandomTerrain
