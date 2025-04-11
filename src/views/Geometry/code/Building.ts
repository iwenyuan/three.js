import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'

class Building extends ThreeBase {
  constructor(config: ThreeBaseConfig) {
    super(config)

    if (this.scene) {
      this.scene.background = new THREE.Color(0x000000)
    }
  }

  protected override onReady(): void {
    console.log(233)
  }

  protected override onRender(): void {
    console.log(233)
  }
}

export default Building
