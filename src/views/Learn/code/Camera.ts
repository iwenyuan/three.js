import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'

class Camera extends ThreeBase {
  constructor(config: ThreeBaseConfig) {
    super(config)
  }

  protected override onReady(): void {}

  protected override onRender(): void {}
}

export default Camera
