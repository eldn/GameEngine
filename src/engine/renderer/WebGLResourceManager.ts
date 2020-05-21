import { Mesh } from "../core/Mesh";


/**
 * WebGLResourceManager 资源管理器
 * @class
 */
class WebGLResourceManager{

    /**
     * 是否有需要销毁的资源
     * @type {boolean}
     * @default false
     */
    hasNeedDestroyResource: boolean = false;


    private _usedResourceDict : Object;

    private _needDestroyDict : Object;

    /**
     * @constructs始化参数，所有params都会复制到实例上
     */
    constructor() {
       
    }

    getClassName() : string{
        return "WebGLResourceManager";
    }

    /**
     * 标记使用资源
     * @param  {Object} res
     * @param  {Mesh} mesh 使用资源的mesh
     * @return {WebGLResourceManager} this
     */
    useResource(res : any, mesh : Mesh) {
        if (res) {
            const key = res.constructor.name + ':' + res.id;
            if (!this._usedResourceDict[key]) {
                this._usedResourceDict[key] = res;

                if (res.useResource) {
                    res.useResource(this, mesh);
                }
            }
        }

        if (mesh) {
            mesh.useResource(res);
        }

        return this;
    }

    /**
     * 没有引用时销毁资源
     * @param  {Object} res
     * @return {WebGLResourceManager} this
     */
    destroyIfNoRef(res) {
        if (!this._needDestroyDict) {
            this._needDestroyDict = {};
        }

        if (res) {
            this.hasNeedDestroyResource = true;
            this._needDestroyDict[res.className + ':' + res.id] = res;
        }

        return this;
    }


    /**
     * 销毁没被使用的资源
     * @return {WebGLResourceManager} this
     */
    destroyUnsuedResource() {
        if (!this.hasNeedDestroyResource) {
            return this;
        }

        const _needDestroyDict = this._needDestroyDict;
        const _usedResourceDict = this._usedResourceDict;
        for (let key in _needDestroyDict) {
            if (!_usedResourceDict[key]) {
                const res = _needDestroyDict[key];
                if (res && !res.alwaysUse && res.destroy) {
                    res.destroy();
                }
            }
        }

        this._needDestroyDict = {};
        this.hasNeedDestroyResource = false;
        return this;
    }

    /**
     * 重置
     * @return {WebGLResourceManager} this
     */
    reset() {
        this._usedResourceDict = {};

        return this;
    }
}

export default WebGLResourceManager;
