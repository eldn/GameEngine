import { Matrix4 } from "./Matrix4";
import math from "./math";
import { Euler } from "./Euler";
import { Quaternion } from "./Quaternion";
import { EventObject } from "../event/EventObject";
import { log } from "../utils/Log";


const tempMatrix = new Matrix4();
const DEG2RAD = math.DEG2RAD;
const RAD2DEG = math.RAD2DEG;

export class EulerNotifier extends EventObject {


    public elements: Float32Array;

    /**
     * 旋转顺序，默认为 ZYX
     */
    public order: string = 'ZYX';

    private _degX: number;
    private _degY: number;
    private _degZ: number;


    /**
     * @param  x 角度 X, 弧度制
     * @param  y  角度 Y, 弧度制
     * @param  z  角度 Z, 弧度制
     */
    constructor(x : number = 0, y : number = 0, z : number = 0) {
        super();
        this.elements = new Float32Array([x, y, z]);
        this.updateDegrees();
    }

    public getClassName() : string{
        return "EulerNotifier";
    }

    /**
     * 克隆
     * @returns 
     */
    public clone() : Euler {
        const euler = new Euler();
        euler.copy(this);
        return euler;
    }

    /**
     * 复制
     * @param euler
     * @returns this
     */
    public copy(euler : EulerNotifier | Euler) : EulerNotifier {
        this.elements[0] = euler.x;
        this.elements[1] = euler.y;
        this.elements[2] = euler.z;
        this.order = euler.order;
        this.updateDegrees();
        return this;
    }

    /**
     * Set the components of a euler to the given values
     * @param  x x 轴旋转角度, 弧度制
     * @param y y 轴旋转角度, 弧度制
     * @param  z z 轴旋转角度, 弧度制
     * @returns this
     */
    public set(x : number, y : number, z : number) : EulerNotifier {
        this.elements[0] = x;
        this.elements[1] = y;
        this.elements[2] = z;
        this.updateDegrees();
        return this;
    }

    /**
     * 设置角度
     * @param degX x 轴旋转角度, 角度制
     * @param degY y 轴旋转角度, 角度制
     * @param degZ z 轴旋转角度, 角度制
     * @returns this
     */
    public setDegree(degX : number, degY : number, degZ : number) : EulerNotifier {
        this._degX = degX;
        this._degY = degY;
        this._degZ = degZ;
        this.updateRadians();
        return this;
    }

    /**
     * 从数组赋值
     * @param   array  数组
     * @param   offset数组偏移值
     * @returns this
     */
    public fromArray(array : Array<number>, offset : number = 0) :EulerNotifier {
        this.elements[0] = array[offset];
        this.elements[1] = array[offset + 1];
        this.elements[2] = array[offset + 2];
        this.updateDegrees();
        return this;
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @returns
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number> {
        array[offset] = this.elements[0];
        array[offset + 1] = this.elements[0 + 1];
        array[offset + 2] = this.elements[0 + 2];
        return array;
    }

    /**
     * Creates a euler from the given 4x4 rotation matrix.
     * Based on https://github.com/mrdoob/three.js/blob/dev/src/math/Euler.js#L133
     * @param mat rotation matrix
     * @param order 旋转顺序，默认为当前Euler实例的order
     * @returns
     */
    public fromMat4(mat : Matrix4, order : string = this.order) : EulerNotifier {

        const elements = mat.elements;
        const m11 = elements[0];
        const m21 = elements[1];
        const m31 = elements[2];
        const m12 = elements[4];
        const m22 = elements[5];
        const m32 = elements[6];
        const m13 = elements[8];
        const m23 = elements[9];
        const m33 = elements[10];

        order = order || this.order;
        this.order = order;

        const clamp = math.clamp;

        if (order === 'XYZ') {
            this.elements[1] = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.99999) {
                this.elements[0] = Math.atan2(-m23, m33);
                this.elements[2] = Math.atan2(-m12, m11);
            } else {
                this.elements[0] = Math.atan2(m32, m22);
                this.elements[2] = 0;
            }
        } else if (order === 'YXZ') {
            this.elements[0] = Math.asin(-clamp(m23, -1, 1));
            if (Math.abs(m23) < 0.99999) {
                this.elements[1] = Math.atan2(m13, m33);
                this.elements[2] = Math.atan2(m21, m22);
            } else {
                this.elements[1] = Math.atan2(-m31, m11);
                this.elements[2] = 0;
            }
        } else if (order === 'ZXY') {
            this.elements[0] = Math.asin(clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.99999) {
                this.elements[1] = Math.atan2(-m31, m33);
                this.elements[2] = Math.atan2(-m12, m22);
            } else {
                this.elements[1] = 0;
                this.elements[2] = Math.atan2(m21, m11);
            }
        } else if (order === 'ZYX') {
            this.elements[1] = Math.asin(-clamp(m31, -1, 1));
            if (Math.abs(m31) < 0.99999) {
                this.elements[0] = Math.atan2(m32, m33);
                this.elements[2] = Math.atan2(m21, m11);
            } else {
                this.elements[0] = 0;
                this.elements[2] = Math.atan2(-m12, m22);
            }
        } else if (order === 'YZX') {
            this.elements[2] = Math.asin(clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.99999) {
                this.elements[0] = Math.atan2(-m23, m22);
                this.elements[1] = Math.atan2(-m31, m11);
            } else {
                this.elements[0] = 0;
                this.elements[1] = Math.atan2(m13, m33);
            }
        } else if (order === 'XZY') {
            this.elements[2] = Math.asin(-clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.99999) {
                this.elements[0] = Math.atan2(m32, m22);
                this.elements[1] = Math.atan2(m13, m11);
            } else {
                this.elements[0] = Math.atan2(-m23, m33);
                this.elements[1] = 0;
            }
        } else {
            log.warn('Euler fromMat4() unsupported order: ' + order);
        }

        this.updateDegrees();
        return this;
    }

    /**
     * Creates a euler from the given quat.
     * @param  quat
     * @param  order 旋转顺序，默认为当前Euler实例的order
     * @returns this
     */
    public fromQuat(quat : Quaternion, order : string = this.order) : EulerNotifier {
        tempMatrix.fromQuat(quat);
        return this.fromMat4(tempMatrix, order);
    }

    public updateDegrees() : EulerNotifier{
        this._degX = this.elements[0] * RAD2DEG;
        this._degY = this.elements[1] * RAD2DEG;
        this._degZ = this.elements[2] * RAD2DEG;
        this.fire('update');
        return this;
    }

    public updateRadians() : EulerNotifier{
        this.elements[0] = this._degX * DEG2RAD;
        this.elements[1] = this._degY * DEG2RAD;
        this.elements[2] = this._degZ * DEG2RAD;
        this.fire('update');
        return this;
    }

    /**
     * 角度 X, 角度制
     */

    get degX() : number {
        return this._degX;
    }

    set degX(value : number) {
        this._degX = value;
        this.elements[0] = value * DEG2RAD;
        this.fire('update');
    }


    /**
     * 角度 Y, 角度制
     */
    get degY() : number {
        return this._degY;
    }

    set degY(value : number) {
        this._degY = value;
        this.elements[1] = value * DEG2RAD;
        this.fire('update');
    }

    /**
     * 角度 Z, 角度制
     */
    get degZ() : number {
        return this._degZ;
    }

    set degZ(value : number) {
        this._degZ = value;
        this.elements[2] = value * DEG2RAD;
        this.fire('update');
    }


    /**
     * 角度 X, 弧度制
     */
    get x() : number {
        return this.elements[0];
    }

    set x(value : number) {
        this.elements[0] = value;
        this._degX = value * RAD2DEG;
        this.fire('update');
    }

    /**
     * 角度 Y, 弧度制
     */
    get y() : number {
        return this.elements[1];
    }

    set y(value : number) {
        this.elements[1] = value;
        this._degY = value * RAD2DEG;
        this.fire('update');
    }

    /**
     * 角度 Z, 弧度制
     */
    get z() : number {
        return this.elements[2];
    }

    set z(value : number) {
        this.elements[2] = value;
        this._degZ = value * RAD2DEG;
        this.fire('update');
    }
}