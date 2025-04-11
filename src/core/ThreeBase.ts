import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export interface ThreeBaseConfig {
  container: string | HTMLElement
}

// abstract 用于定义抽象类和其中的抽象方法。抽象类不允许被实例化
abstract class ThreeBase {
  public config: ThreeBaseConfig
  public container: HTMLElement
  public scene: THREE.Scene | null = null
  public camera: THREE.PerspectiveCamera | null = null
  public renderer: THREE.WebGLRenderer | null = null
  public controls: OrbitControls | null = null
  private animationFrameId: number | null = null

  constructor(config: ThreeBaseConfig) {
    this.config = config
    const { container } = this.config
    // 容器元素，可以是CSS选择器或DOM元素
    this.container =
      typeof container === 'string' ? (document.querySelector(container) as HTMLElement) : container

    if (!this.container) {
      throw new Error('Container element not found')
    }

    this.prepare()
  }

  prepare(): void {
    // 初始化
    this.init()
    // 绑定事件
    this.bindEvents()
    // 添加要素
    this.onReady()

    this.start()
  }

  // 抽象类中的抽象方法必须被子类实现
  // protected 确保只有子类可以访问该方法
  // abstract 强制子类必须实现该方法
  protected abstract onReady(): void

  protected abstract onRender(): void

  init(): void {
    // 创建场景
    this.scene = new THREE.Scene()

    // 创建相机
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    this.camera.position.z = 5

    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.container.appendChild(this.renderer.domElement)

    // 坐标轴辅助
    const axesHelper = new THREE.AxesHelper(5)
    this.scene.add(axesHelper)

    // 轨道控制器
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  bindEvents(): void {
    // 监听窗口尺寸变化
    window.addEventListener('resize', this.handleResize.bind(this))
  }

  handleResize() {
    if (!this.camera || !this.renderer) return

    // 更新相机宽高比
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()

    // 更新渲染器尺寸
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
  }

  animate(): void {
    // 渲染循环
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this))

    this.onRender()

    this.controls?.update()

    if (this.scene && this.camera && this.renderer) {
      this.renderer.render(this.scene, this.camera)
    }
  }

  start(): void {
    // 开始动画循环
    this.animate()
  }

  destroy(): void {
    // 移除事件监听
    window.removeEventListener('resize', this.handleResize.bind(this))

    // 停止动画循环
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    // 清除渲染器
    if (this.renderer) {
      this.renderer.dispose()
      this.container.removeChild(this.renderer.domElement)
    }

    // 清除场景中的所有对象
    if (this.scene) {
      this.scene.traverse((object: THREE.Object3D) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose()
          }

          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material) => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        }
      })
    }

    // 清空属性
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
  }
}

export default ThreeBase
