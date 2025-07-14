import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'
import tools from '@/utils/tools'

class Tunnel extends ThreeBase {
  private tubePoints: THREE.Vector3[] = []

  constructor(config: ThreeBaseConfig) {
    super(config)

    this.initTunnel()
  }

  protected override onReady(): void {
    this.scene!.background = new THREE.Color('#000')
    this.camera!.position.set(100, 100, 100)
  }

  private i: number = 0
  protected override onRender(): void {
    if (this.tubePoints && this.i < this.tubePoints.length - 1) {
      this.camera?.position.copy(this.tubePoints[this.i])
      this.camera?.lookAt(this.tubePoints[this.i + 1])
      this.i += 1
    }
  }

  private initTunnel() {
    const loader = new THREE.TextureLoader()
    const texture = loader.load(tools.getAssetsFile('texture/tunnel.png'))
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.repeat.x = 10

    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-100, 0, 0),
      new THREE.Vector3(-50, 50, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(50, 50, 0),
      new THREE.Vector3(100, 0, 0)
    ])
    const tube = new THREE.TubeGeometry(path, 100, 5, 30)
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      aoMap: texture, // 受环境影响的贴图
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(tube, material)
    this.scene!.add(mesh)

    this.tubePoints = path.getSpacedPoints(1000)
  }
}

export default Tunnel
