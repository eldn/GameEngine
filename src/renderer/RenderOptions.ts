export interface RenderOptions{
    SIDE ?: number;
    HAS_LIGHT ?:number;
    PREMULTIPLY_ALPHA ?:number;
    HAS_NORMAL ?:number;
    NORMAL_MAP_SCALE ?:number;
    IGNORE_TRANSPARENT ?:number;
    ALPHA_CUTOFF ?:number;
    USE_HDR ?:number;
    GAMMA_CORRECTION ?:number;
    RECEIVE_SHADOWS ?:number;
    CAST_SHADOWS ?:number;
    USE_PHYSICS_LIGHT ?:number;
    IS_DIFFUESENV_AND_AMBIENTLIGHT_WORK_TOGETHER ?:number;
    HAS_TEXCOORD0 ?: number;
    HAS_SPECULAR ?: number;
    DIFFUSE_CUBE_MAP ?: number;
    HAS_FRAG_POS ?: number;
    WRITE_ORIGIN_DATA ?: number;
    UV_MATRIX ?: number;
    UV_MATRIX1 ?: number;
}