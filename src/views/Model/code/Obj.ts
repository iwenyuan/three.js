import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

class Obj extends ThreeBase {
  constructor(config: ThreeBaseConfig) {
    super(config)

    if (this.scene) {
      this.scene.background = new THREE.Color(0x000000)
    }
  }

  protected override onReady(): void {
    this.addLight()

    this.loadOBJModel()
  }

  protected override onRender(): void {}

  addLight(): void {
    // 主光源：平行光，模拟太阳光
    const keyLight = new THREE.DirectionalLight(0xffffff, 1)
    keyLight.position.set(5, 10, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024

    // 补光：点光源
    const fillLight = new THREE.PointLight(0xffffff, 0.5)
    fillLight.position.set(-5, 3, -5)

    // 背光：突出轮廓
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5)
    backLight.position.set(-3, 5, -5)

    // 环境光
    const ambientLight1 = new THREE.AmbientLight(0xffffff, 0.2)
    const ambientLight2 = new THREE.AmbientLight(0x00bb8f, 0.5)
    const ambientLight3 = new THREE.AmbientLight(0xffc0cb, 0.3)

    this.scene?.add(keyLight, fillLight, backLight, ambientLight1, ambientLight2, ambientLight3)

    const gui = new GUI()
    gui.add(keyLight, 'intensity', 0, 2).name('主光源')
    gui.add(fillLight, 'intensity', 0, 2).name('补光')
    gui.add(backLight, 'intensity', 0, 2).name('背光')
    gui.add(ambientLight1, 'intensity', 0, 2).name('环境光1')
    gui.add(ambientLight2, 'intensity', 0, 2).name('环境光2')
    gui.add(ambientLight3, 'intensity', 0, 2).name('环境光3')
  }

  private loadOBJModel(): void {
    const texturePath = './src/assets/model/elf/shaded.png'

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(texturePath)

    const material = new THREE.MeshStandardMaterial({ map: texture })

    const loader = new OBJLoader()
    loader.load(
      './src/assets/model/elf/base.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material
          }
        })
        this.scene?.add(obj)
      },
      (xhr) => {
        console.log(`Loading: ${((xhr.loaded / xhr.total) * 100).toFixed(2)}% loaded`)
      },
      (error) => {
        console.error('An error happened while loading the OBJ model:', error)
      }
    )
  }
}

export default Obj
