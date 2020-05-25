import { Vector3 } from "./Vector3";
import {vec3} from 'gl-matrix';
import { EventObject } from "../event/EventObject";


export class Vector3Notifier extends EventObject{


    public elements : vec3;

    /**
     * Creates a new empty vec3
     * @param {Number} [x=0] X component
     * @param {Number} [y=0] Y component
     * @param {Number} [z=0] Z component
     * @constructs
     */
    constructor(x = 0, y = 0, z = 0) {
        super();
        /**
         * 数据
         * @type {Float32Array}
         */
        this.elements = vec3.fromValues(x, y, z);
    }

    getClassName() : string{
        return "Vector3Notifier";
    }

    /**
     * Copy the values from one vec3 to this
     * @param  {Vector3} m the source vector
     * @return {Vector3} this
     */
    copy(v) {
        vec3.copy(this.elements, v.elements);
        this.fire('update');
        return this;
    }
    /**
     * Creates a new vec3 initialized with values from this vec3
     * @return {Vector3} a new Vector3
     */
    clone() {
        const elements = this.elements;
        return new Vector3Notifier(elements[0], elements[1], elements[2]);
    }
    /**
     * 转换到数组
     * @param  {Array}  [array=[]] 数组
     * @param  {Number} [offset=0] 数组偏移值
     * @return {Array}
     */
    toArray(array = [], offset = 0) {
        const elements = this.elements;
        array[0 + offset] = elements[0];
        array[1 + offset] = elements[1];
        array[2 + offset] = elements[2];
        return array;
    }
    /**
     * 从数组赋值
     * @param  {Array} array  数组
     * @param  {Number} [offset=0] 数组偏移值
     * @return {Vector3} this
     */
    fromArray(array, offset = 0) {
        const elements = this.elements;
        elements[0] = array[offset + 0];
        elements[1] = array[offset + 1];
        elements[2] = array[offset + 2];
        this.fire('update');
        return this;
    }
    /**
     * Set the components of a vec3 to the given values
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {Vector3Notifier} this
     */
    set(x, y, z) {
        vec3.set(this.elements, x, y, z);
        this.fire('update');
        return this;
    }
    /**
     * Adds two vec3's
     * @param {Vector3} a
     * @param {Vector3} [b] 如果不传，计算 this 和 a 的和
     * @returns {Vector3Notifier} this
     */
    add(a : Vector3Notifier | Vector3, b ?: Vector3Notifier | Vector3) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.add(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Subtracts vector b from vector a
     * @param {Vector3} a
     * @param {Vector3} [b] 如果不传，计算 this 和 a 的差
     * @returns {Vector3Notifier} this
     */
    subtract(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.subtract(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Multiplies two vec3's
     * @param {Vector3} a
     * @param {Vector3} [b] 如果不传，计算 this 和 a 的积
     * @returns {Vector3Notifier} this
     */
    multiply(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.multiply(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Divides two vec3's
     * @param {Vector3} a
     * @param {Vector3} [b] 如果不传，计算 this 和 a 的商
     * @returns {Vector3Notifier} this
     */
    divide(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.divide(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Math.ceil the components of this
     * @returns {Vector3Notifier} this
     */
    ceil() {
        vec3.ceil(this.elements, this.elements);
        this.fire('update');
        return this;
    }
    /**
     * Math.floor the components of this
     * @returns {Vector3Notifier} this
     */
    floor() {
        vec3.floor(this.elements, this.elements);
        this.fire('update');
        return this;
    }
    /**
     * Returns the minimum of two vec3's
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @returns {Vector3Notifier} this
     */
    min(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.min(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Returns the maximum of two vec3's
     * @param  {Vector3} a
     * @param  {Vector3} [b]  如果不传，计算 this 和 a 的结果
     * @returns {Vector3Notifier} this
     */
    max(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.max(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Math.round the components of this
     * @returns {Vector3Notifier} this
     */
    round() {
        vec3.round(this.elements, this.elements);
        this.fire('update');
        return this;
    }
    /**
     * Scales this by a scalar number
     * @param  {Number} scale amount to scale the vector by
     * @returns {Vector3Notifier} this
     */
    scale(scale) {
        vec3.scale(this.elements, this.elements, scale);
        this.fire('update');
        return this;
    }
    /**
     * Adds two vec3's after scaling the second vector by a scalar value
     * @param  {Number} scale the amount to scale the second vector by before adding
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @returns {Vector3Notifier} this
     */
    scaleAndAdd(scale, a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.scaleAndAdd(this.elements, a.elements, b.elements, scale);
        this.fire('update');
        return this;
    }
    /**
     * Calculates the euclidian distance between two vec3's
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @return {Number} distance between a and b
     */
    distance(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.distance(a.elements, b.elements);
    }
    /**
     * Calculates the squared euclidian distance between two vec3's
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @return {Number} squared distance between a and b
     */
    squaredDistance(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.squaredDistance(a.elements, b.elements);
    }
    /**
     * Calculates the length of this
     * @return {Number} length of this
     */
    length() {
        return vec3.length(this.elements);
    }
    /**
     * Calculates the squared length of this
     * @return {Number} squared length of this
     */
    squaredLength() {
        return vec3.squaredLength(this.elements);
    }
    /**
     * Negates the components of this
     * @returns {Vector3Notifier} this
     */
    negate() {
        vec3.negate(this.elements, this.elements);
        this.fire('update');
        return this;
    }
    /**
     * Returns the inverse of the components of a vec3
     * @param  {Vector3} [a=this]
     * @returns {Vector3Notifier} this
     */
    inverse(a) {
        if (!a) {
            a = this;
        }
        vec3.inverse(this.elements, a.elements);
        this.fire('update');
        return this;
    }
    /**
     * Normalize this
     * @returns {Vector3Notifier} this
     */
    normalize() {
        vec3.normalize(this.elements, this.elements);
        this.fire('update');
        return this;
    }
    /**
     * Calculates the dot product of two vec3's
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @return {Number}  product of a and b
     */
    dot(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.dot(a.elements, b.elements);
    }
    /**
     * Computes the cross product of two vec3's
     * @param  {Vector2} a
     * @param  {Vector2} [b] 如果不传，计算 this 和 a 的结果
     * @return {Number}  cross product of a and b
     */
    cross(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        vec3.cross(this.elements, a.elements, b.elements);
        this.fire('update');
        return this;
    }
    /**
     * Performs a linear interpolation between two vec3's
     * @param  {Vector3} v
     * @param  {Number} t interpolation amount between the two vectors
     * @returns {Vector3Notifier} this
     */
    lerp(v, t) {
        vec3.lerp(this.elements, this.elements, v.elements, t);
        this.fire('update');
        return this;
    }
    /**
     * Performs a hermite interpolation with two control points
     * @param  {Vector3} a
     * @param  {Vector3} b
     * @param  {Vector3} c
     * @param  {Vector3} d
     * @param  {Number} t interpolation amount between the two inputs
     * @return {Vector3} this
     */
    hermite(a, b, c, d, t) {
        vec3.hermite(this.elements, a.elements, b.elements, c.elements, d.elements, t);
        this.fire('update');
        return this;
    }
    /**
     * Performs a bezier interpolation with two control points
     * @param  {Vector3} a
     * @param  {Vector3} b
     * @param  {Vector3} c
     * @param  {Vector3} d
     * @param  {Number} t interpolation amount between the two inputs
     * @return {Vector3} this
     */
    bezier(a, b, c, d, t) {
        vec3.bezier(this.elements, a.elements, b.elements, c.elements, d.elements, t);
        this.fire('update');
        return this;
    }
    /**
     * Generates a random vector with the given scale
     * @param  {Number} [scale=1] Length of the resulting vector. If ommitted, a unit vector will be returned
     * @returns {Vector3Notifier} this
     */
    random(scale) {
        vec3.random(this.elements, scale);
        this.fire('update');
        return this;
    }
    /**
     * Transforms the vec3 with a mat3
     * @param  {Matrix3} m matrix to transform with
     * @returns {Vector3Notifier} this
     */
    transformMat3(m) {
        vec3.transformMat3(this.elements, this.elements, m.elements);
        this.fire('update');
        return this;
    }
    /**
     * Transforms the vec3 with a mat4
     * @param  {Matrix4} m matrix to transform with
     * @returns {Vector3Notifier} this
     */
    transformMat4(m) {
        vec3.transformMat4(this.elements, this.elements, m.elements);
        this.fire('update');
        return this;
    }
    /**
     * Transforms the vec3 direction with a mat4
     * @param  {Matrix4} m matrix to transform with
     * @returns {Vector3Notifier} this
     */
    transformDirection(m) {
        const elements = this.elements;
        const mElements = m.elements;
        const x = elements[0];
        const y = elements[1];
        const z = elements[2];

        elements[0] = x * mElements[0] + y * mElements[4] + z * mElements[8];
        elements[1] = x * mElements[1] + y * mElements[5] + z * mElements[9];
        elements[2] = x * mElements[2] + y * mElements[6] + z * mElements[10];

        this.fire('update');
        return this;
    }
    /**
     * Transforms the vec3 with a quat
     * @param  {Quaternion} q quaternion to transform with
     * @returns {Vector3Notifier} this
     */
    transformQuat(q) {
        vec3.transformQuat(this.elements, this.elements, q.elements);
        this.fire('update');
        return this;
    }
    /**
     * Rotate this 3D vector around the x-axis
     * @param  {Vector3} origin The origin of the rotation
     * @param  {Number} rotation The angle of rotation
     * @return {Vector3} this
     */
    rotateX(origin, rotation) {
        vec3.rotateX(this.elements, this.elements, origin.elements, rotation);
        this.fire('update');
        return this;
    }
    /**
     * Rotate this 3D vector around the y-axis
     * @param  {Vector3} origin The origin of the rotation
     * @param  {Number} rotation The angle of rotation
     * @return {Vector3} this
     */
    rotateY(origin, rotation) {
        vec3.rotateY(this.elements, this.elements, origin.elements, rotation);
        this.fire('update');
        return this;
    }
    /**
     * Rotate this 3D vector around the z-axis
     * @param  {Vector3} origin The origin of the rotation
     * @param  {Number} rotation The angle of rotation
     * @return {Vector3} this
     */
    rotateZ(origin, rotation) {
        vec3.rotateZ(this.elements, this.elements, origin.elements, rotation);
        this.fire('update');
        return this;
    }
    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @return {Boolean} True if the vectors are equal, false otherwise.
     */
    exactEquals(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.exactEquals(a.elements, b.elements);
    }
    /**
     * Returns whether or not the vectors have approximately the same elements in the same position.
     * @param  {Vector3} a
     * @param  {Vector3} [b] 如果不传，计算 this 和 a 的结果
     * @return {Boolean} True if the vectors are equal, false otherwise.
     */
    equals(a, b) {
        if (!b) {
            b = a;
            a = this;
        }
        return vec3.equals(a.elements, b.elements);
    }

    /**
     * X component
     * @type {Number}
     */
    get x() {
        return this.elements[0];
    }

    set x(value) {
        this.elements[0] = value;
        this.fire('update');
    }
    
    /**
     * Y component
     * @type {Number}
     */
    get y() {
        return this.elements[1];
    }
    
    set y(value) {
        this.elements[1] = value;
        this.fire('update');
    }
    
    /**
     * Z component
     * @type {Number}
     */
    get z() {
        return this.elements[2];
    }

    set z(value) {
        this.elements[2] = value;
        this.fire('update');
    }
}