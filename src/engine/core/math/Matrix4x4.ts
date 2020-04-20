import { Vector3 } from "./Vector3";
import { Vector2 } from "./Vector2";


let _a00: number = 0; let _a01: number = 0; let _a02: number = 0; let _a03: number = 0;
let _a10: number = 0; let _a11: number = 0; let _a12: number = 0; let _a13: number = 0;
let _a20: number = 0; let _a21: number = 0; let _a22: number = 0; let _a23: number = 0;
let _a30: number = 0; let _a31: number = 0; let _a32: number = 0; let _a33: number = 0;

export class Matrix4x4 {

    private _data: number[] = [];


    private constructor() {
        this._data = [
            1.0, 0, 0, 0,
            0, 1.0, 0, 0,
            0, 0, 1.0, 0,
            0, 0, 0, 1.0
        ];
    }

    public get data(): number[] {
        return this._data;
    }

    public static identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    public static orthographic( left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let lr: number = 1.0 / ( left - right );
        let bt: number = 1.0 / ( bottom - top );
        let nf: number = 1.0 / ( nearClip - farClip );

        m._data[0] = -2.0 * lr;

        m._data[5] = -2.0 * bt;

        m._data[10] = 2.0 * nf;

        m._data[12] = ( left + right ) * lr;
        m._data[13] = ( top + bottom ) * bt;
        m._data[14] = ( farClip + nearClip ) * nf;

        return m;
    }

  
    public static perspective( fov: number, aspect: number, nearClip: number, farClip: number ): Matrix4x4 {
        let f = 1.0 / Math.tan( fov / 2 );
        let nf = 1 / ( nearClip - farClip );

        // data
        let m = new Matrix4x4();
        m._data = [
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, ( nearClip + farClip ) * nf, -1,
            0, 0, nearClip * farClip * nf * 2, 0
        ];
        return m;
    }

   
    public static translation( position: Vector3 ): Matrix4x4 {
        let m = new Matrix4x4();

        m._data[12] = position.x;
        m._data[13] = position.y;
        m._data[14] = position.z;

        return m;
    }

 
    public static rotationX( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[5] = c;
        m._data[6] = s;
        m._data[9] = -s;
        m._data[10] = c;

        return m;
    }

   
    public static rotationY( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[0] = c;
        m._data[2] = -s;
        m._data[8] = s;
        m._data[10] = c;

        return m;
    }

   
    public static rotationZ( angleInRadians: number ): Matrix4x4 {
        let m = new Matrix4x4();

        let c = Math.cos( angleInRadians );
        let s = Math.sin( angleInRadians );

        m._data[0] = c;
        m._data[1] = s;
        m._data[4] = -s;
        m._data[5] = c;

        return m;
    }


    public static rotationXYZ( xRadians: number, yRadians: number, zRadians: number ): Matrix4x4 {
        let rx = Matrix4x4.rotationX( xRadians );
        let ry = Matrix4x4.rotationY( yRadians );
        let rz = Matrix4x4.rotationZ( zRadians );

        // ZYX
        return Matrix4x4.multiply( Matrix4x4.multiply( rz, ry ), rx );
    }

  
    public static scale( scale: Vector3 ): Matrix4x4 {
        let m = new Matrix4x4();

        m._data[0] = scale.x;
        m._data[5] = scale.y;
        m._data[10] = scale.z;

        return m;
    }

 
    public static multiply( a: Matrix4x4, b: Matrix4x4 ): Matrix4x4 {
        let m = new Matrix4x4();

        let b00 = b._data[0 * 4 + 0];
        let b01 = b._data[0 * 4 + 1];
        let b02 = b._data[0 * 4 + 2];
        let b03 = b._data[0 * 4 + 3];
        let b10 = b._data[1 * 4 + 0];
        let b11 = b._data[1 * 4 + 1];
        let b12 = b._data[1 * 4 + 2];
        let b13 = b._data[1 * 4 + 3];
        let b20 = b._data[2 * 4 + 0];
        let b21 = b._data[2 * 4 + 1];
        let b22 = b._data[2 * 4 + 2];
        let b23 = b._data[2 * 4 + 3];
        let b30 = b._data[3 * 4 + 0];
        let b31 = b._data[3 * 4 + 1];
        let b32 = b._data[3 * 4 + 2];
        let b33 = b._data[3 * 4 + 3];
        let a00 = a._data[0 * 4 + 0];
        let a01 = a._data[0 * 4 + 1];
        let a02 = a._data[0 * 4 + 2];
        let a03 = a._data[0 * 4 + 3];
        let a10 = a._data[1 * 4 + 0];
        let a11 = a._data[1 * 4 + 1];
        let a12 = a._data[1 * 4 + 2];
        let a13 = a._data[1 * 4 + 3];
        let a20 = a._data[2 * 4 + 0];
        let a21 = a._data[2 * 4 + 1];
        let a22 = a._data[2 * 4 + 2];
        let a23 = a._data[2 * 4 + 3];
        let a30 = a._data[3 * 4 + 0];
        let a31 = a._data[3 * 4 + 1];
        let a32 = a._data[3 * 4 + 2];
        let a33 = a._data[3 * 4 + 3];

        m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
        m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
        m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
        m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
        m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
        m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
        m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
        m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
        m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
        m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
        m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
        m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
        m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
        m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
        m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
        m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

        return m;
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this._data);
    }


    public copyFrom(m: Matrix4x4): void {
        for (let i = 0; i < 16; ++i) {
            this._data[i] = m._data[i];
        }
    }

    public set(x: number, y: number, v: number): Matrix4x4 {
        this._data[x][y] = v;
        return this;
    }

    public get(x: number, y: number): number {
        return this._data[x][y];
    }

     /**
     * @zh 根据视点计算矩阵，注意 `eye - center` 不能为零向量或与 `up` 向量平行
     * @param eye 当前位置
     * @param center 目标视点
     * @param up 视口上方向
     */
    public static lookAt (out: Matrix4x4, eye: Vector3, center: Vector3, up: Vector3) {
        const eyex = eye.x;
        const eyey = eye.y;
        const eyez = eye.z;
        const upx = up.x;
        const upy = up.y;
        const upz = up.z;
        const centerx = center.x;
        const centery = center.y;
        const centerz = center.z;

        let z0 = eyex - centerx;
        let z1 = eyey - centery;
        let z2 = eyez - centerz;

        let len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= len;
        z1 *= len;
        z2 *= len;

        let x0 = upy * z2 - upz * z1;
        let x1 = upz * z0 - upx * z2;
        let x2 = upx * z1 - upy * z0;
        len = 1 / Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        x0 *= len;
        x1 *= len;
        x2 *= len;

        const y0 = z1 * x2 - z2 * x1;
        const y1 = z2 * x0 - z0 * x2;
        const y2 = z0 * x1 - z1 * x0;

        out._data[0] = x0;
        out._data[1] = y0;
        out._data[2] = z0;
        out._data[3] = 0;
        out._data[4] = x1;
        out._data[5] = y1;
        out._data[6] = z1;
        out._data[7] = 0;
        out._data[8] = x2;
        out._data[9] = y2;
        out._data[10] = z2;
        out._data[11] = 0;
        out._data[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
        out._data[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
        out._data[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
        out._data[15] = 1;

        return out;
    }


    /**
     * @zh 计算逆转置矩阵
     */
    public static inverseTranspose <Out extends Matrix4x4> (out: Out, a: Out) {

        _a00 = a._data[0]; _a01 = a._data[1]; _a02 = a._data[2]; _a03 = a._data[3];
        _a10 = a._data[4]; _a11 = a._data[5]; _a12 = a._data[6]; _a13 = a._data[7];
        _a20 = a._data[8]; _a21 = a._data[9]; _a22 = a._data[10]; _a23 = a._data[11];
        _a30 = a._data[12]; _a31 = a._data[13]; _a32 = a._data[14]; _a33 = a._data[15];

        const b00 = _a00 * _a11 - _a01 * _a10;
        const b01 = _a00 * _a12 - _a02 * _a10;
        const b02 = _a00 * _a13 - _a03 * _a10;
        const b03 = _a01 * _a12 - _a02 * _a11;
        const b04 = _a01 * _a13 - _a03 * _a11;
        const b05 = _a02 * _a13 - _a03 * _a12;
        const b06 = _a20 * _a31 - _a21 * _a30;
        const b07 = _a20 * _a32 - _a22 * _a30;
        const b08 = _a20 * _a33 - _a23 * _a30;
        const b09 = _a21 * _a32 - _a22 * _a31;
        const b10 = _a21 * _a33 - _a23 * _a31;
        const b11 = _a22 * _a33 - _a23 * _a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out._data[0] = (_a11 * b11 - _a12 * b10 + _a13 * b09) * det;
        out._data[1] = (_a12 * b08 - _a10 * b11 - _a13 * b07) * det;
        out._data[2] = (_a10 * b10 - _a11 * b08 + _a13 * b06) * det;
        out._data[3] = 0;

        out._data[4] = (_a02 * b10 - _a01 * b11 - _a03 * b09) * det;
        out._data[5] = (_a00 * b11 - _a02 * b08 + _a03 * b07) * det;
        out._data[6] = (_a01 * b08 - _a00 * b10 - _a03 * b06) * det;
        out._data[7] = 0;

        out._data[8] = (_a31 * b05 - _a32 * b04 + _a33 * b03) * det;
        out._data[9] = (_a32 * b02 - _a30 * b05 - _a33 * b01) * det;
        out._data[10] = (_a30 * b04 - _a31 * b02 + _a33 * b00) * det;
        out._data[11] = 0;

        out._data[12] = 0;
        out._data[13] = 0;
        out._data[14] = 0;
        out._data[15] = 1;

        return out;
    }
}