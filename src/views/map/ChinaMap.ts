/**
 * 中国地图
 */

export class ChinaMap {
    // public scene: THREE.Scene;
    // public camera: THREE.PerspectiveCamera;
    // public renderer: THREE.WebGLRenerer;

    constructor() {
        this.init()
    }

    //新建一个场景
    init(): void {
        // this.scene = new THREE.Scene()
        this.setCamera()
        this.setRender()

    }

    // 建立透视相机
    setCamera(): void {
        // this.camera = new THREE.PerspectiveCamera(
        //     75,
        //     innerWidth / innerHeight,
        //     0.1,
        //     1000
        // );
    }

    // 设置渲染器
    setRender(): void {
        // this.renderer = new THREE.WebGLRenderer()
        // // 设置画布大小
        // this.renderer.setSize(innerWidth, innerHeight)
        // // 其实就是canvas画布
        // document.body.appendChild(this.renderer.domElement);

    }
}




















