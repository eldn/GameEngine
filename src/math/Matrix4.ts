import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';
import { mat4 } from "gl-matrix";
import { Vector3Notifier } from './Vector3Notifier';
import { Matrix4Notifier } from './Matrix4Notifier';
import { Matrix3 } from './Matrix3';


let tempMatrix4;
const tempVector3 = new Vector3();

export class Matrix4{

    /**
     * 数据
     */
    public elements : mat4;

    /**
     * Creates a new identity mat4
     */
    constructor() {
        
        this.elements = mat4.create();
    }

    public getClassName() : string{
        return "Matrix4";
    }

    /**
     * Copy the values from one mat4 to this
     * @param   m the source matrix
     * @returns this
     */
    public copy(m : Matrix4 | Matrix4Notifier) : Matrix4{
        mat4.copy(this.elements, m.elements);
        return this;
    }

    /**
     * Creates a new mat4 initialized with values from this matrix
     * @return a new Matrix4
     */
    public clone() : Matrix4 {
        const m = new Matrix4();
        mat4.copy(m.elements, this.elements);
        return m;
    }

    /**
     * 转换到数组
     * @param  array 数组
     * @param  offset 数组偏移值
     * @return
     */
    public toArray(array : Array<number> = [], offset : number = 0) : Array<number>{
        const elements = this.elements;
        for (let i = 0; i < 16; i++) {
            array[offset + i] = elements[i];
        }
        return array;
    }

    /**
     * 从数组赋值
     * @param  array  数组
     * @param  offset 数组偏移值
     * @return  this
     */
    public fromArray(array : Array<number>, offset : number = 0) : Matrix4 {
        const elements = this.elements;
        for (let i = 0; i < 16; i++) {
            elements[i] = array[offset + i];
        }
        return this;
    }

    /**
     * Set the components of a mat3 to the given values
     * @param  m00
     * @param  m01
     * @param  m02
     * @param m03
     * @param  m10
     * @param  m11
     * @param m12
     * @param  m13
     * @param m20
     * @param  m21
     * @param m22
     * @param  m23
     * @param  m30
     * @param  m31
     * @param m32
     * @param  m33
     * @return {Matrix4} this
     */
    public set(m00 : number, m01: number, m02: number, m03: number, m10: number, m11: number, m12: number, m13: number, m20: number, m21: number, m22: number, m23: number, m30: number, m31: number, m32: number, m33: number) : Matrix4 {
        mat4.set(this.elements, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
        return this;
    }

    /**s
     * Set this to the identity matrix
     * @returns this
     */
    public identity() : Matrix4 {
        mat4.identity(this.elements);
        return this;
    }
    
    /**
     * Transpose the values of this
     * @returns this
     */
    public transpose() : Matrix4 {
        mat4.transpose(this.elements, this.elements);
        return this;
    }

    /**
     * invert a matrix
     * @param m
     * @returns this
     */
    public invert(m :Matrix4  = this) : Matrix4{
        mat4.invert(this.elements, m.elements);
        return this;
    }

    /**
     * Calculates the adjugate of a mat4
     * @param m
     * @returns this
     */
    public adjoint(m : Matrix4 = this) : Matrix4{
        mat4.adjoint(this.elements, m.elements);
        return this;
    }

    /**
     * Calculates the determinant of this
     * @returns this
     */
    public determinant() : number {
        return mat4.determinant(this.elements);
    }

    /**
     * Multiplies two matrix4's
     * @param  a
     * @param b 如果不传，计算 this 和 a 的乘积
     * @returns this
     */
    public multiply(a : Matrix4 | Matrix4Notifier, b ?: Matrix4 | Matrix4Notifier) : Matrix4{
        if (!b) {
            b = a;
            a = this;
        }
        mat4.multiply(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * 左乘
     * @param  m
     * @returns this
     */
    public premultiply(m : Matrix4) : Matrix4 {
        this.multiply(m, this);
        return this;
    }

    /**
     * Translate this by the given vector
     * @param  v vector to translate by
     * @return this
     */
    public translate(v : Vector3) : Matrix4 {
        mat4.translate(this.elements, this.elements, v.elements);
        return this;
    }

    /**
     * Scales the mat3 by the dimensions in the given vec2
     * @param v the vec3 to scale the matrix by
     * @return this
     */
    public scale(v : Vector3) : Matrix4 {
        mat4.scale(this.elements, this.elements, v.elements);
        return this;
    }

    /**
     * Rotates this by the given angle
     * @param  rad the angle to rotate the matrix by
     * @param  axis the axis to rotate around
     * @return this
     */
    public rotate(rad : number, axis : Vector3) : Matrix4 {
        mat4.rotate(this.elements, this.elements, rad, axis.elements);
        return this;
    }

    /**
     * Rotates this by the given angle around the X axis
     * @param  rad the angle to rotate the matrix by
     * @return  this
     */
    public rotateX(rad : number) : Matrix4 {
        mat4.rotateX(this.elements, this.elements, rad);
        return this;
    }

    /**
     * Rotates this by the given angle around the Y axis
     * @param  rad the angle to rotate the matrix by
     * @return  this
     */
    public rotateY(rad : number) : Matrix4 {
        mat4.rotateY(this.elements, this.elements, rad);
        return this;
    }

    /**
     * Rotates this by the given angle around the Z axis
     * @param rad the angle to rotate the matrix by
     * @return  this
     */
    public rotateZ(rad : number) : Matrix4 {
        mat4.rotateZ(this.elements, this.elements, rad);
        return this;
    }

    /**
     * Creates a matrix from a vector translation
     * @param transition Translation vector
     * @return  this
     */
    public fromTranslation(v : Vector3) : Matrix4{
        mat4.fromTranslation(this.elements, v.elements);
        return this;
    }

    /**
     * Creates a matrix from a vector scaling
     * @param   v Scaling vector
     * @return  this
     */
    public fromScaling(v : Vector3) : Matrix4 {
        mat4.fromScaling(this.elements, v.elements);
        return this;
    }

    /**
     * Creates a matrix from a given angle around a given axis
     * @param  rad the angle to rotate the matrix by
     * @param axis the axis to rotate around
     * @return  this
     */
    public fromRotation(rad : number, axis : Vector3) : Matrix4 {
        mat4.fromRotation(this.elements, rad, axis.elements);
        return this;
    }
    
    /**
     * Creates a matrix from the given angle around the X axis
     * @param  rad the angle to rotate the matrix by
     * @return  this
     */
    public fromXRotation(rad : number) : Matrix4 {
        mat4.fromXRotation(this.elements, rad);
        return this;
    }

    /**
     * Creates a matrix from the given angle around the Y axis
     * @param rad the angle to rotate the matrix by
     * @return  this
     */
    public fromYRotation(rad : number) : Matrix4 {
        mat4.fromYRotation(this.elements, rad);
        return this;
    }

    /**
     * Creates a matrix from the given angle around the Z axis
     * @param rad the angle to rotate the matrix by
     * @return this
     */
    public fromZRotation(rad : number) : Matrix4 {
        mat4.fromZRotation(this.elements, rad);
        return this;
    }

    /**
     * Creates a matrix from a quaternion rotation and vector translation
     * @param  q Rotation quaternion
     * @param   v Translation vector
     * @return this
     */
    public fromRotationTranslation(q : Quaternion, v : Vector3) : Matrix4 {
        mat4.fromRotationTranslation(this.elements, q.elements, v.elements);
        return this;
    }

    /**
     * Returns the translation vector component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslation,
     *  the returned vector will be the same as the translation vector
     *  originally supplied.
     * @param   out Vector to receive translation component
     * @return  out
     */
    public getTranslation(out : Vector3 = new Vector3()) : Vector3 {
        mat4.getTranslation(out.elements, this.elements);
        return out;
    }

    /**
     * Returns the scaling factor component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslationScale
     *  with a normalized Quaternion paramter, the returned vector will be
     *  the same as the scaling vector
     *  originally supplied.
     * @param out Vector to receive scaling factor component
     * @return  out
     */
    public getScaling(out : Vector3 = new Vector3()) : Vector3{
        mat4.getScaling(out.elements, this.elements);
        return out;
    }

    /**
     * Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     * @param  out Quaternion to receive the rotation component
     * @return out
     */
    public getRotation(out : Quaternion = new Quaternion()) : Quaternion {
        mat4.getRotation(out.elements, this.elements);
        return out;
    }

    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale
     * @param   q Rotation quaternion
     * @param  v Translation vector
     * @param  s Scaling vector
     * @return  this
     */
    public fromRotationTranslationScale(q : Quaternion, v : Vector3, s : Vector3) : Matrix4{
        mat4.fromRotationTranslationScale(this.elements, q.elements, v.elements, s.elements);
        return this;
    }

    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
     * @param   q Rotation quaternion
     * @param   v Translation vector
     * @param  s Scaling vector
     * @param  o The origin vector around which to scale and rotate
     * @return  this
     */
    public fromRotationTranslationScaleOrigin(q : Quaternion, v : Vector3, s : Vector3, o : Vector3) : Matrix4 {
        mat4.fromRotationTranslationScaleOrigin(this.elements, q.elements, v.elements, s.elements, o.elements);
        return this;
    }

    /**
     * Calculates a 4x4 matrix from the given quaternion
     * @param q Quaternion to create matrix from
     * @return this
     */
    public fromQuat(q : Quaternion) : Matrix4 {
        mat4.fromQuat(this.elements, q.elements);
        return this;
    }

    /**
     * Generates a frustum matrix with the given bounds
     * @param  left  Left bound of the frustum
     * @param   right Right bound of the frustum
     * @param  bottom Bottom bound of the frustum
     * @param  top Top bound of the frustum
     * @param  near Near bound of the frustum
     * @param   far Far bound of the frustum
     * @return this
     */
    public frustum(left : number, right : number, bottom : number, top : number, near : number, far : number) : Matrix4{
        mat4.frustum(this.elements, left, right, bottom, top, near, far);
        return this;
    }

    /**
     * Generates a perspective projection matrix with the given bounds
     * @param  fovy Vertical field of view in radians
     * @param aspect Aspect ratio. typically viewport width/height
     * @param  near Near bound of the frustum
     * @param far Far bound of the frustum
     * @return  this
     */
    public perspective(fovy : number, aspect : number, near : number, far : number) : Matrix4 {
        mat4.perspective(this.elements, fovy, aspect, near, far);
        return this;
    }

    /**
     * Generates a perspective projection matrix with the given field of view.
     * @param  fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
     * @param   Near bound of the frustum
     * @param  far Far bound of the frustum
     * @return this
     */
    public perspectiveFromFieldOfView(fov : Object, near : number, far : number) : Matrix4 {
        mat4.perspectiveFromFieldOfView(this.elements, fov, near, far);
        return this;
    }

    /**
     * Generates a orthogonal projection matrix with the given bounds
     * @param  left  Left bound of the frustum
     * @param  right Right bound of the frustum
     * @param   bottom Bottom bound of the frustum
     * @param   top Top bound of the frustum
     * @param near Near bound of the frustum
     * @param  far Far bound of the frustum
     * @return  this
     */
    public ortho(left : number, right : number, bottom : number, top : number, near : number, far : number) : Matrix4 {
        mat4.ortho(this.elements, left, right, bottom, top, near, far);
        return this;
    }

    /**
     * Generates a look-at matrix with the given eye position, focal point, and up axis
     * @param   eye Position of the viewer
     * @param   center Point the viewer is looking at
     * @param  up pointing up
     * @return this
     */
    public lookAt(eye : Vector3, center : Vector3, up : Vector3) : Matrix4 {
        mat4.lookAt(this.elements, eye.elements, center.elements, up.elements);
        return this;
    }

    /**
     * Generates a matrix that makes something look at something else.
     * @param   eye Position of the viewer
     * @param   Point the viewer is looking at
     * @param  up pointing up
     * @return  this
     */
    public targetTo(eyePos : Vector3 | Vector3Notifier, targetPos : Vector3 | Vector3Notifier, upVector : Vector3) : Matrix4 {

        // mat4.targetTo(this.elements, eye.elements, target.elements, up.elements);
        let eye = eyePos.elements;
        let target = targetPos.elements;
        let up = upVector.elements;
        const out = this.elements;

        let eyex = eye[0];
        let eyey = eye[1];
        let eyez = eye[2];
        let upx = up[0];
        let upy = up[1];
        let upz = up[2];

        let z0 = eyex - target[0];
        let z1 = eyey - target[1];
        let z2 = eyez - target[2];

        let len = z0 * z0 + z1 * z1 + z2 * z2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        } else {
            z2 = 1;
        }

        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;

        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        } else {
            upx += 0.0000001;

            x0 = upy * z2 - upz * z1;
            x1 = upz * z0 - upx * z2;
            x2 = upx * z1 - upy * z0;
            len = x0 * x0 + x1 * x1 + x2 * x2;
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return this;
    }

    /**
     * Returns Frobenius norm of a mat4
     * @return  Frobenius norm
     */
    public frob() : number {
        return mat4.frob(this.elements);
    }

    /**
     * Adds two mat4's
     * @param a
     * @param b 如果不传，计算 this 和 a 的和
     * @return  this
     */
    public add(a : Matrix4, b ?: Matrix4) : Matrix4 {
        if (!b) {
            b = a;
            a = this;
        }
        mat4.add(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Subtracts matrix b from matrix a
     * @param  a
     * @param b  如果不传，计算 this 和 a 的差
     * @return  this
     */
    public subtract(a : Matrix4, b ?: Matrix4) : Matrix4 {
        if (!b) {
            b = a;
            a = this;
        }
        mat4.subtract(this.elements, a.elements, b.elements);
        return this;
    }

    /**
     * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
     * @param  a
     * @param b 如果不传，比较 this 和 a 是否相等
     * @return
     */
    public exactEquals(a : Matrix4, b ?: Matrix4) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return mat4.exactEquals(a.elements, b.elements);
    }

    /**
     * Returns whether or not the matrices have approximately the same elements in the same position.
     * @param  a
     * @param b 如果不传，比较 this 和 a 是否近似相等
     * @return
     */
    public equals(a : Matrix4, b ?: Matrix4) : boolean {
        if (!b) {
            b = a;
            a = this;
        }
        return mat4.equals(a.elements, b.elements);
    }

    /**
     * compose
     * @param  q quaternion
     * @param  v position
     * @param  s scale
     * @param   p [pivot]
     * @return   this
     */
    public compose(q : Quaternion, v : Vector3, s : Vector3, p : Vector3) : Matrix4{
        if (p) {
            this.fromRotationTranslationScaleOrigin(q, v, s, p);
        } else {
            this.fromRotationTranslationScale(q, v, s);
        }
        return this;
    }

    /**
     * decompose
     * @param   q quaternion
     * @param   v position
     * @param  s scale
     * @param   p [pivot]
     * @return   this
     */
    public decompose(q : Quaternion, v : Vector3, s : Vector3, p : Vector3) : Matrix4 {
        this.getScaling(s);
        this.getTranslation(v);

        if (!tempMatrix4) {
            tempMatrix4 = new Matrix4();
        }

        const det = this.determinant();
        if (det < 0) s.x *= -1;

        tempMatrix4.copy(this);
        tempVector3.inverse(s);
        tempMatrix4.scale(tempVector3);

        q.fromMat4(tempMatrix4);

        if (p) {
            p.set(0, 0, 0);
        }
        return this;
    }
}