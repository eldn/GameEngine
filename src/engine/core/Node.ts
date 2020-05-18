import { Vector3 } from "../math/Vector3";
import { Matrix4 } from "../math/Matrix4";
import { EventNode } from "../event/EventNode";
import math from "../math/math";
import { Matrix4Notifier } from "../math/Matrix4Notifier";
import { Vector3Notifier } from "../math/Vector3Notifier";
import { EulerNotifier } from "../math/EulerNotifier";
import { Quaternion } from "../math/Quaternion";
import { log } from "../utils/Log";


const defaultUp = new Vector3(0, 1, 0);
const tempMatrix4 = new Matrix4();

const TRAVERSE_STOP_NONE = false;
const TRAVERSE_STOP_CHILDREN = 1;
const TRAVERSE_STOP_ALL = true;

/**
 * 节点，3D场景中的元素，是大部分类的基类
 * @class
 * @mixes EventMixin
 * @example
 * const node = new Hilo3d.Node({
 *     name:'test',
 *     x:100,
 *     rotationX:30,
 *     onUpdate(){
 *         this.rotationY ++;
 *     }
 * });
 * node.scaleX = 0.3;
 * stage.addChild(node);
 */
export class Node extends EventNode{
 
    /**
     * Node 的名字，可以通过 getChildByName 查找
     * @type {string}
     */
    name: string = '';


    /**
     * 是否自动更新世界矩阵
     * @default true
     * @type {boolean}
     */
    autoUpdateWorldMatrix: boolean = true;

    /**
     * 是否自动更新子元素世界矩阵
     * @default true
     * @type {boolean}
     */
    autoUpdateChildWorldMatrix: boolean = true;

    /**
     * 父节点
     * @default null
     * @type {Node}
     */
    parent: Node = null;
    _quatDirty: boolean = false;
    _matrixDirty: boolean = false;

    /**
     * 每次更新的时候是否调用子节点的 onUpdate 方法
     * @default true
     * @type {boolean}
     */
    needCallChildUpdate: boolean = true;

    /**
     * 节点是否显示
     * @default true
     * @type {boolean}
     */
    visible: boolean = true;

    /**
     * 可视对象是否接受交互事件。默认为接受交互事件，即true。
     * @default true
     * @type {Boolean}
     */
    pointerEnabled: boolean = true;

    /**
     * 子元素是否接受交互事件。
     * @default true
     * @type {Boolean}
     */
    pointerChildren: boolean = true;

    /**
     * 是否用鼠标指针
     * @default false
     * @type {Boolean}
     */
    useHandCursor: boolean = false;

    /**
     * 是否强制使用父元素 worldMatrix，供高级开发者使用
     * @private
     * @type {Boolean}
     */
    __forceUseParentWorldMatrix: boolean = false;


     /**
     * @type {string}
     */
    id : string;

    /**
     * 元素的up向量
     * @type {Vector3}
     */
    up : Vector3;

    /**
     * 元素直接点数组
     * @type {Node[]}
     */
    children : Array<Node>;

    /**
     * 元素的世界矩阵
     * @type {Matrix4}
     */
    worldMatrix : Matrix4;

    constructor() {
        super();

       
        this.id = math.generateUUID(this.constructor.name);
        
        this.up = defaultUp.clone();
        
        this.children = [];
        
        this.worldMatrix = new Matrix4();

        this._matrix = new Matrix4Notifier();
        this._position = new Vector3Notifier(0, 0, 0);
        this._scale = new Vector3Notifier(1, 1, 1);
        this._pivot = new Vector3Notifier(0, 0, 0);
        this._rotation = new EulerNotifier();
        this._quaternion = new Quaternion();

        this._matrix.on('update', () => {
            this._onMatrixUpdate();
        });

        this._position.on('update', () => {
            this._onPositionUpdate();
        });

        this._scale.on('update', () => {
            this._onScaleUpdate();
        });

        this._pivot.on('update', () => {
            this._onPivotUpdate();
        });

        this._rotation.on('update', () => {
            this._onRotationUpdate();
        });

        this._quaternion.on('update', () => {
            this._onQuaternionUpdate();
        });
    }

    /**
     * @param {boolean} [isChild=false] 是否子节点，子节点不会处理动画及骨骼Mesh，即如果有动画将共享
     * @return {Node} 返回clone的Node
     */
    clone(isChild) {
        const node = new Node();
        node.name = this.name;
        node.setPosition(this.x, this.y, this.z);
        node.setScale(this.scaleX, this.scaleY, this.scaleZ);
        node.setRotation(this.rotationX, this.rotationY, this.rotationZ);
        this.children.forEach((child) => {
            node.addChild(child.clone(true));
        });
        return node;
    }


    /**
     * 将所以子孙元素放到一个对象中，对象key为元素的name，value为该元素
     * @return {Object} 返回获取的对象
     */
    getChildrenNameMap() {
        const map = {};
        this.traverse((child) => {
            map[child.name] = child;

            // fix smd animation bug
            const originName = child._originName;
            if (originName !== undefined && !map[originName]) {
                map[originName] = child;
            }
        }, true);
        return map;
    }
    /**
     * 添加一个子元素
     * @param {Node} child 需要添加的子元素
     * @return {Node} this
     */
    addChild(child) {
        if (child.parent) {
            child.removeFromParent();
        }
        child.parent = this;
        this.children.push(child);

        return this;
    }
    /**
     * 移除指定的子元素
     * @param {Node} child 需要移除的元素
     * @return {Node} this
     */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parent = null;
        }
        return this;
    }
    /**
     * 将当前元素添加到某个父元素的子元素中
     * @param {Node} parent 需要添加到的父元素
     * @return {Node} this
     */
    addTo(parent) {
        parent.addChild(this);
        return this;
    }
    /**
     * 将当前元素从其父元素中移除
     * @return {Node} this
     */
    removeFromParent() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        return this;
    }
    /**
     * 更新本地矩阵
     * @return {Node} this
     */
    updateMatrix() {
        if (this._matrixDirty) {
            this._matrixDirty = false;
            this.matrixVersion++;
            this._matrix.fromRotationTranslationScaleOrigin(this.quaternion, this._position, this._scale, this._pivot, true);
        }

        return this;
    }

    /**
     * 更新四元数
     * @return {Node} this
     */
    updateQuaternion() {
        if (this._quatDirty) {
            this._quatDirty = false;
            this._quaternion.fromEuler(this._rotation, true);
        }

        return this;
    }

    /**
     * 更新transform属性
     * @return {Node} this
     */
    updateTransform() {
        this._matrix.decompose(this._quaternion, this._position, this._scale, this._pivot);
        this._onQuaternionUpdate();

        this._matrixDirty = false;
        return this;
    }
    /**
     * 更新世界矩阵
     * @param  {Boolean} [force=true] 是否强制更新
     * @return {Node} this
     */
    updateMatrixWorld(force) {
        this.traverse((node) => {
            if (node.autoUpdateWorldMatrix || force) {
                if (node.parent) {
                    if (!node.__forceUseParentWorldMatrix) {
                        node.worldMatrix.multiply(node.parent.worldMatrix, node.matrix);
                    } else {
                        node.worldMatrix.copy(node.parent.worldMatrix);
                    }
                } else {
                    node.worldMatrix.copy(node.matrix);
                }
            }

            if (!node.autoUpdateChildWorldMatrix && !force) {
                return TRAVERSE_STOP_CHILDREN;
            }

            return TRAVERSE_STOP_NONE;
        });
        return this;
    }
 
    /**
     * _traverse
     * @private
     * @param  {Function(Node)} callback
     * @param  {Boolean}  onlyChild
     * @return {Enum}  TRAVERSE_STOP_ALL, TRAVERSE_STOP_CHILDREN, TRAVERSE_STOP_NONE
     */
    _traverse(callback, onlyChild) {
        if (!onlyChild) {
            const res = callback(this);
            if (res) {
                return res;
            }
        }

        const children = this.children;
        for (let i = 0, l = children.length; i < l; i++) {
            const res = children[i]._traverse(callback, false);
            if (res === TRAVERSE_STOP_ALL) {
                return res;
            }
        }

        return TRAVERSE_STOP_NONE;
    }
    /**
     * 遍历当前元素的子孙元素
     * @param {Function(Node)} callback 每个元素都会调用这个函数处理
     * @param {Boolean} [onlyChild=false] 是否只遍历子元素
     * @return {Node} this
     */
    traverse(callback, onlyChild = false) {
        this._traverse(callback, onlyChild);
        return this;
    }
    /**
     * 遍历当前元素的子孙元素(广度优先)
     * @param {Function(Node)} callback 每个元素都会调用这个函数处理
     * @param {Boolean} [onlyChild=false] 是否只遍历子元素
     * @return {Node} this
     */
    traverseBFS(callback, onlyChild = false) {
        let currentQueue;
        let nextQueue;
        if (!onlyChild) {
            nextQueue = [this];
        } else {
            nextQueue = this.children;
        }

        while (nextQueue.length) {
            currentQueue = nextQueue;
            nextQueue = [];
            for (let i = 0, l = currentQueue.length; i < l; i++) {
                const child = currentQueue[i];
                const res = callback(child);
                if (!res) {
                    nextQueue = nextQueue.concat(child.children);
                } else if (res === TRAVERSE_STOP_ALL) {
                    return this;
                }
            }
        }
        return this;
    }
    /**
     * 根据函数来获取一个子孙元素(广度优先)
     * @param {Function} fn 判读函数
     * @return {Node|null} 返回获取到的子孙元素
     */
    getChildByFnBFS(fn) {
        let result = null;
        this.traverseBFS((child) => {
            if (fn(child)) {
                result = child;
                return TRAVERSE_STOP_ALL;
            }
            return TRAVERSE_STOP_NONE;
        }, true);

        return result;
    }
    /**
     * 根据 name path 来获取子孙元素
     * @param  {String[]} path 名字数组, e.g., getChildByNamePath(['a', 'b', 'c'])
     * @return {Node|null} 返回获取到的子孙元素
     */
    getChildByNamePath(path) {
        let currentNode = this;
        for (let i = 0, l = path.length; i < l; i++) {
            const name = path[i];
            const node = currentNode.getChildByFnBFS(child => child.name === name);
            if (node) {
                currentNode = node;
            } else {
                return null;
            }
        }

        return currentNode;
    }
    /**
     * 遍历调用子孙元素onUpdate方法
     * @param  {Number} dt
     * @return {Node} this
     */
    traverseUpdate(dt) {
        this.traverse((node) => {
            if (node.onUpdate) {
                node.onUpdate(dt);
            }
            if (!node.needCallChildUpdate) {
                return TRAVERSE_STOP_CHILDREN;
            }
            return TRAVERSE_STOP_NONE;
        });
        return this;
    }
    /**
     * 根据函数来获取一个子孙元素
     * @param {Function} fn 判读函数
     * @return {Node|null} 返回获取到的子孙元素
     */
    getChildByFn(fn) {
        let result = null;
        this.traverse((child) => {
            if (fn(child)) {
                result = child;
                return TRAVERSE_STOP_ALL;
            }
            return TRAVERSE_STOP_NONE;
        }, true);

        return result;
    }
    /**
     * 根据函数来获取匹配的所有子孙元素
     * @param {Function} fn 判读函数
     * @return {Node[]} 返回获取到的子孙元素
     */
    getChildrenByFn(fn) {
        let result = [];
        this.traverse((child) => {
            if (fn(child)) {
                result.push(child);
            }
        }, true);
        return result;
    }
    /**
     * 获取指定name的首个子孙元素
     * @param {string} name 元素name
     * @return {Node|null} 获取的元素
     */
    getChildByName(name) {
        return this.getChildByFn(child => child.name === name);
    }
    /**
     * 获取指定name的所有子孙元素
     * @param {string} name 元素name
     * @return {Node[]} 获取的元素数组
     */
    getChildrenByName(name) {
        return this.getChildrenByFn(child => child.name === name);
    }
    /**
     * 获取指定id的子孙元素
     * @param {string} id 元素id
     * @return {Node|null} 获取的元素
     */
    getChildById(id) {
        return this.getChildByFn(child => child.id === id);
    }
    /**
     * 获取指定类名的所有子孙元素
     * @param {string} className 类名
     * @return {Node[]} 获取的元素数组
     */
    getChildrenByClassName(className) {
        return this.getChildrenByFn(child => child.className === className);
    }
    /**
     * 获取指定基类名的所有子孙元素
     * @param {string} className 类名
     * @return {Node[]} 获取的元素数组
     */
    getChildrenByBaseClassName(className) {
        return this.getChildrenByFn(child => child['is' + className]);
    }
    /**
     * 设置元素的缩放比例
     * @param {number} x X缩放比例
     * @param {number} y Y缩放比例
     * @param {number} z Z缩放比例
     * @return {Node} this
     */
    setScale(x, y = x, z = y) {
        this._scale.set(x, y, z);
        return this;
    }
    /**
     * 设置元素的位置
     * @param {number} x X方向位置
     * @param {number} y Y方向位置
     * @param {number} z Z方向位置
     * @return {Node} this
     */
    setPosition(x, y, z) {
        this._position.set(x, y, z);
        return this;
    }
    /**
     * 设置元素的旋转
     * @param {number} x X轴旋转角度, 角度制
     * @param {number} y Y轴旋转角度, 角度制
     * @param {number} z Z轴旋转角度, 角度制
     * @return {Node} this
     */
    setRotation(x, y, z) {
        this._rotation.setDegree(x, y, z);
        return this;
    }
    /**
     * 设置中心点
     * @param {Number} x 中心点x
     * @param {Number} y 中心点y
     * @param {Number} z 中心点z
     * @return {Node} this
     */
    setPivot(x, y, z) {
        this._pivot.set(x, y, z);
        return this;
    }
    /**
     * 改变元素的朝向
     * @param {Node|Object|Vector3} node 需要朝向的元素，或者坐标
     * @return {Node} this
     */
    lookAt(node) {
        tempMatrix4.targetTo(node, this.position, this.up);
        this._quaternion.fromMat4(tempMatrix4);
        return this;
    }
    /**
     * raycast
     * @param  {Ray} ray
     * @param {Boolean} [sort=false] 是否按距离排序
     * @param {Boolean} [eventMode=false] 是否事件模式
     * @return {raycastInfo[]|null}
     */
    raycast(ray, sort = false, eventMode = false) {
        if (!this.visible) {
            return null;
        }
        let resArray = [];
        this.traverse((child) => {
            if (eventMode && !child.pointerEnabled) {
                return TRAVERSE_STOP_CHILDREN;
            }

            if (child.isMesh) {
                const res = child.raycast(ray, false);
                if (res) {
                    resArray = resArray.concat(res.map((point) => {
                        return {
                            mesh: child,
                            point
                        };
                    }));
                }
            }

            if (eventMode && !this.pointerChildren) {
                return TRAVERSE_STOP_CHILDREN;
            }

            return false;
        });

        if (resArray.length) {
            if (sort) {
                ray.sortPoints(resArray, 'point');
            }
            return resArray;
        }

        return null;
    }

    private _matrix : Matrix4Notifier;

    /**
     * 元素的矩阵
     * @type {Matrix4Notifier}
     * @readOnly
     */
    get matrix() {
        this.updateMatrix();
        return this._matrix;
    }

    set matrix(value) {
        log.warnOnce('Node.matrix.set', 'node.matrix is readOnly.Use node.matrix.copy instead.');
        this._matrix.copy(value);
    }
    
    private _position : Vector3Notifier;

    /**
     * 位置
     * @type {Vector3Notifier}
     * @readOnly
     */
    get position() {
        return this._position;
    }

    set position(value) {
        log.warnOnce('Node.position.set', 'node.position is readOnly.Use node.position.copy instead.');
        this._position.copy(value);
    }
    

    /**
     * x轴坐标
     * @type {number}
     */
    get x() {
        return this._position.elements[0];
    }

    set x(value) {
        this._position.elements[0] = value;
        this._matrixDirty = true;
    }
    
    /**
     * y轴坐标
     * @type {number}
     */
    get y() {
        return this._position.elements[1];
    }

    set y(value) {
        this._position.elements[1] = value;
        this._matrixDirty = true;
    }
    
    /**
     * z轴坐标
     * @type {number}
     */
    get z() {
        return this._position.elements[2];
    }

    set z(value) {
        this._position.elements[2] = value;
        this._matrixDirty = true;
    }
    

    private _scale : Vector3Notifier;

    /**
     * 缩放
     * @type {Vector3Notifier}
     * @readOnly
     */
    get scale() {
        return this._scale;
    }

    set scale(value) {
        log.warnOnce('Node.scale.set', 'node.scale is readOnly.Use node.scale.copy instead.');
        this._scale.copy(value);
    }
    

    /**
     * 缩放比例x
     * @type {number}
     */
    get scaleX() {
        return this._scale.elements[0];
    }

    set scaleX(value) {
        this._scale.elements[0] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 缩放比例y
     * @type {number}
     */
    get scaleY() {
        return this._scale.elements[1];
    }

    set scaleY(value) {
        this._scale.elements[1] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 缩放比例z
     * @type {number}
     */
    get scaleZ() {
        return this._scale.elements[2];
    }

    set scaleZ(value) {
        this._scale.elements[2] = value;
        this._matrixDirty = true;
    }
    

    /**
     * 中心点
     * @type {Vector3Notifier}
     * @readOnly
     */
    private _pivot : Vector3Notifier;
    
    get pivot() {
        return this._pivot;
    }

    set pivot(value) {
        log.warnOnce('Node.pivot.set', 'node.pivot is readOnly.Use node.pivot.copy instead.');
        this._pivot.copy(value);
    }
    

    /**
     * 中心点x
     * @type {Number}
     */
    get pivotX() {
        return this._pivot.elements[0];
    }

    set pivotX(value) {
        this._pivot.elements[0] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 中心点y
     * @type {Number}
     */
    get pivotY() {
        return this._pivot.elements[1];
    }

    set pivotY(value) {
        this._pivot.elements[1] = value;
        this._matrixDirty = true;
    }
    
    /**
     * 中心点z
     * @type {Number}
     */
    get pivotZ() {
        return this._pivot.elements[2];
    }

    set pivotZ(value) {
        this._pivot.elements[2] = value;
        this._matrixDirty = true;
    }
    

    /**
     * 欧拉角
     * @type {EulerNotifier}
     * @readOnly
     */
    private _rotation : EulerNotifier;

    get rotation() {
        return this._rotation;
    }

    set rotation(value) {
        log.warnOnce('Node.rotation.set', 'node.rotation is readOnly.Use node.rotation.copy instead.');
        this._rotation.copy(value);
    }
    

    /**
     * 旋转角度 x, 角度制
     * @type {number}
     */
    get rotationX () {
        return this._rotation.degX;
    }

    set rotationX(value) {
        this._rotation.degX = value;
    }
    
    /**
     * 旋转角度 y, 角度制
     * @type {number}
     */
    get rotationY() {
        return this._rotation.degY;
    }

    set rotationY(value) {
        this._rotation.degY = value;
    }
    
    /**
     * 旋转角度 z, 角度制
     * @type {number}
     */
    get rotationZ() {
        return this._rotation.degZ;
    }

    set rotationZ(value) {
        this._rotation.degZ = value;
    }
    

    /**
     * 四元数角度
     * @type {Quaternion}
     */
    private _quaternion : Quaternion;

    get quaternion() {
        this.updateQuaternion();
        return this._quaternion;
    }
    
    set quaternion(value) {
        log.warnOnce('Node.quaternion.set', 'node.quaternion is readOnly.Use node.quaternion.copy instead.');
        this._quaternion.copy(value);
    }
    

    matrixVersion: number = 0;

    /**
     * 销毁 Node 资源
     * @param {WebGLRenderer} renderer
     * @param {Boolean} [destroyTextures=false] 是否销毁材质的贴图，默认不销毁
     * @return {Node} this
     */
    destroy(renderer, destroyTextures = false) {
        const nodes = this.getChildrenByBaseClassName('Node');
        this.off();
        nodes.forEach((node) => {
            if (node.isMesh) {
                node.destroy(renderer, destroyTextures);
            } else {
                node.off();
                node.removeFromParent();
            }
        });

        this.removeFromParent();
        return this;
    }

    _onMatrixUpdate() {
        this.matrixVersion++;
        this.updateTransform();
    }
    _onPositionUpdate() {
        this._matrixDirty = true;
    }
    _onScaleUpdate() {
        this._matrixDirty = true;
    }
    _onPivotUpdate() {
        this._matrixDirty = true;
    }
    _onRotationUpdate() {
        this._quatDirty = true;
        this._matrixDirty = true;
    }
    _onQuaternionUpdate() {
        this._rotation.fromQuat(this._quaternion);
        this._quatDirty = false;
    }
}

export default Node;

/**
 * 包围盒信息
 * @typedef {object} Bounds
 * @property {number} x 包围盒中心的X坐标
 * @property {number} y 包围盒中心的Y坐标
 * @property {number} z 包围盒中心的Z坐标
 * @property {number} width 包围盒的宽度
 * @property {number} height 包围盒的高度
 * @property {number} depth 包围盒的深度
 * @property {number} xMin X轴的最小值
 * @property {number} xMax X轴的最大值
 * @property {number} yMin Y轴的最小值
 * @property {number} yMax Y轴的最大值
 * @property {number} zMin Z轴的最小值
 * @property {number} zMax Z轴的最大值
 */


/**
 * 碰撞信息
 * @typedef {object} raycastInfo
 * @property {Mesh} mesh 碰撞的 mesh
 * @property {Vector3} point 碰撞得点
 */