import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'

class Material extends ThreeBase {
  constructor(config: ThreeBaseConfig) {
    super(config)

    this.initMaterial()
  }

  protected override onReady(): void {
    this.scene!.background = new THREE.Color('#000')
    this.camera!.position.set(100, 100, 100)
  }

  protected override onRender(): void {}

  private initMaterial(): void {
    this.addDashedMaterial()
  }

  addDashedMaterial(): void {
    const geometry = new THREE.BoxGeometry(100, 100, 100)
    const edgesGeometry = new THREE.EdgesGeometry(geometry)
    const material = new THREE.LineDashedMaterial({
      color: new THREE.Color('orange'),
      dashSize: 10,
      gapSize: 10
    })
    const mesh = new THREE.Line(edgesGeometry, material)
    mesh.computeLineDistances()
    this.scene!.add(mesh)
  }

  addTextureMaterial(): void {}
}

export default Material
