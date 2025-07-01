import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export interface ThreeBaseConfig {
  container: string | HTMLElement
  width?: number
  height?: number
  backgroundColor?: THREE.ColorRepresentation
  enableAxes?: boolean
  enableControls?: boolean
}

// 抽象类，用于定义 Three.js 应用的基础结构
abstract class ThreeBase {
  protected readonly config: ThreeBaseConfig
  protected readonly container: HTMLElement
  protected scene: THREE.Scene | null = null
  protected camera: THREE.PerspectiveCamera | null = null
  protected renderer: THREE.WebGLRenderer | null = null
  protected controls: OrbitControls | null = null
  private animationFrameId: number | null = null
  private isDestroyed = false

  constructor(config: ThreeBaseConfig) {
    this.config = {
      enableAxes: true,
      enableControls: true,
      ...config
    }

    this.container = this.resolveContainer(config.container)
    this.prepare()
  }

  private resolveContainer(container: string | HTMLElement): HTMLElement {
    const element = typeof container === 'string' ? document.querySelector(container) : container

    if (!element || !(element instanceof HTMLElement)) {
      throw new Error(`Container element not found: ${container}`)
    }

    return element
  }

  private prepare(): void {
    try {
      // 等待DOM完全加载后再初始化
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initialize())
      } else {
        this.initialize()
      }
    } catch (error) {
      console.error('Failed to initialize ThreeBase:', error)
      this.destroy()
      throw error
    }
  }

  private initialize(): void {
    this.init()
    this.bindEvents()
    this.onReady()
    this.start()
  }

  // 抽象方法，子类必须实现
  protected abstract onReady(): void
  protected abstract onRender(): void

  private init(): void {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createHelpers()
    this.createControls()
  }

  private createScene(): void {
    this.scene = new THREE.Scene()

    if (this.config.backgroundColor) {
      this.scene.background = new THREE.Color(this.config.backgroundColor)
    }
  }

  private createCamera(): void {
    const width = this.config.width ?? this.container.clientWidth
    const height = this.config.height ?? this.container.clientHeight
    const aspect = width / height

    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.set(5, 5, 5)
    this.camera.lookAt(0, 0, 0)
  }

  private createRenderer(): void {
    if (!this.camera) throw new Error('Camera must be created before renderer')

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })

    // 确保容器有正确的尺寸
    this.updateContainerSize()

    const width = this.config.width ?? this.container.clientWidth
    const height = this.config.height ?? this.container.clientHeight

    this.renderer.setSize(width, height, false) // 第三个参数设为false，不更新canvas的style
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1

    this.container.appendChild(this.renderer.domElement)

    // 设置canvas样式以确保填满容器
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.renderer.domElement.style.display = 'block'
  }

  private createHelpers(): void {
    if (!this.scene || !this.config.enableAxes) return

    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)
  }

  private createControls(): void {
    if (!this.camera || !this.renderer || !this.config.enableControls) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.screenSpacePanning = false
    this.controls.minDistance = 1
    this.controls.maxDistance = 50
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  private updateContainerSize(): void {
    // 确保容器有正确的尺寸，如果容器尺寸为0，等待下一帧再获取
    if (this.container.clientWidth === 0 || this.container.clientHeight === 0) {
      requestAnimationFrame(() => this.updateContainerSize())
      return
    }
  }

  private handleResize = (): void => {
    if (this.isDestroyed || !this.camera || !this.renderer) return

    const width = this.container.clientWidth
    const height = this.container.clientHeight
    const aspect = width / height

    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height, false)

    // 确保canvas样式正确
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
  }

  private animate = (): void => {
    if (this.isDestroyed) return

    this.animationFrameId = requestAnimationFrame(this.animate)
    this.onRender()
    this.controls?.update()
    this.render()
  }

  private render(): void {
    if (!this.scene || !this.camera || !this.renderer) return
    this.renderer.render(this.scene, this.camera)
  }

  private start(): void {
    this.animate()
  }

  public destroy(): void {
    if (this.isDestroyed) return
    this.isDestroyed = true

    // 移除事件监听
    window.removeEventListener('resize', this.handleResize)

    // 停止动画循环
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }

    // 销毁控制器
    this.controls?.dispose()

    // 销毁渲染器
    if (this.renderer) {
      this.renderer.dispose()
      this.container.removeChild(this.renderer.domElement)
    }

    // 清理场景资源
    this.disposeScene()

    // 清空引用
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
  }

  private disposeScene(): void {
    if (!this.scene) return

    this.scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        this.disposeMesh(object)
      }
    })
  }

  private disposeMesh(mesh: THREE.Mesh): void {
    // 销毁几何体
    if (mesh.geometry) {
      mesh.geometry.dispose()
    }

    // 销毁材质
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose())
      } else {
        mesh.material.dispose()
      }
    }
  }

  // 公共方法，供子类使用
  protected getScene(): THREE.Scene {
    if (!this.scene) throw new Error('Scene not initialized')
    return this.scene
  }

  protected getCamera(): THREE.PerspectiveCamera {
    if (!this.camera) throw new Error('Camera not initialized')
    return this.camera
  }

  protected getRenderer(): THREE.WebGLRenderer {
    if (!this.renderer) throw new Error('Renderer not initialized')
    return this.renderer
  }

  protected getControls(): OrbitControls | null {
    return this.controls
  }

  public isActive(): boolean {
    return !this.isDestroyed
  }

  // 强制更新渲染器尺寸
  public updateSize(): void {
    if (this.isDestroyed || !this.camera || !this.renderer) return

    const width = this.container.clientWidth
    const height = this.container.clientHeight

    if (width > 0 && height > 0) {
      const aspect = width / height
      this.camera.aspect = aspect
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height, false)

      // 确保canvas样式正确
      this.renderer.domElement.style.width = '100%'
      this.renderer.domElement.style.height = '100%'
    }
  }
}

export default ThreeBase
