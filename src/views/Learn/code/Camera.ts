import * as THREE from 'three'
import ThreeBase from '@/core/ThreeBase'
import type { ThreeBaseConfig } from '@/core/ThreeBase'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

class Camera extends ThreeBase {
  private debugCamera!: THREE.PerspectiveCamera
  private cameraHelper!: THREE.CameraHelper

  constructor(config: ThreeBaseConfig) {
    super(config)
    this.cameraInit()
  }

  protected override onReady(): void {
    this.scene!.background = new THREE.Color('#000')
  }

  protected override onRender(): void {}

  private cameraInit(): void {
    this.addLight()
    this.addBoxGeometry()
    this.addCameraHelper()
    this.addGui()

    this.camera?.position.set(0, 1, 800)
    this.camera?.lookAt(0, 0, 0)
  }

  private addBoxGeometry(): void {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshLambertMaterial({ color: new THREE.Color('orange') })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene?.add(mesh)
  }

  private addLight(): void {
    const light = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene?.add(light)
  }

  private addCameraHelper(): void {
    this.debugCamera = new THREE.PerspectiveCamera(20, 16 / 9, 100, 300)
    this.debugCamera.position.set(0, 0, 150)
    this.scene?.rotateY(-Math.PI / 2)
    this.debugCamera.lookAt(0, 0, 0)
    this.cameraHelper = new THREE.CameraHelper(this.debugCamera)
    this.scene?.add(this.cameraHelper)
  }

  private addGui(): void {
    const gui = new GUI()
    gui.add(this.debugCamera, 'fov', [30, 60, 10]).onChange(this.onChange.bind(this))
    gui
      .add(this.debugCamera, 'aspect', {
        '16/9': 16 / 9,
        '4/3': 4 / 3
      })
      .onChange(this.onChange.bind(this))
    gui.add(this.debugCamera, 'near', 0, 300).onChange(this.onChange.bind(this))
    gui.add(this.debugCamera, 'far', 300, 800).onChange(this.onChange.bind(this))
  }

  private onChange() {
    this.debugCamera.updateProjectionMatrix()
    this.cameraHelper.update()
  }
}

export default Camera
