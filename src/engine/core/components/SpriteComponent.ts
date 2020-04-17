import { IComponentData } from "./IComponentData";
import { Vector3 } from "../math/Vector3";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./BaseComponent";
import { Shader } from "../gl/shaders/Shader";
import { Sprite } from "../graphics/Sprite";
import { Matrix4x4 } from "../math/Matrix4x4";

export class SpriteComponentData implements IComponentData {
    public name: string;
    public materialName: string;
    public origin: Vector3 = Vector3.zero;
    public width: number;
    public height: number;

    public setFromJson(json: any): void {
        if (json.name !== undefined) {
            this.name = String(json.name);
        }

        if (json.width !== undefined) {
            this.width = Number(json.width);
        }

        if (json.height !== undefined) {
            this.height = Number(json.height);
        }

        if (json.materialName !== undefined) {
            this.materialName = String(json.materialName);
        }

        if (json.origin !== undefined) {
            this.origin.setFromJson(json.origin);
        }
    }
}


export class SpriteComponentBuilder implements IComponentBuilder {

    public get type(): string {
        return "sprite";
    }

    public buildFromJson(json: any): IComponent {
        let data = new SpriteComponentData();
        data.setFromJson(json);
        return new SpriteComponent(data);
    }
}


export class SpriteComponent extends BaseComponent {

    private _sprite: Sprite;
    private _width: number;
    private _height: number;


    public constructor(data: SpriteComponentData) {
        super(data);

        this._width = data.width;
        this._height = data.height;
        this._sprite = new Sprite(name, data.materialName, this._width, this._height);
        if (!data.origin.equals(Vector3.zero)) {
            this._sprite.origin.copyFrom(data.origin);
        }
    }

    public load(): void {
        this._sprite.load();
    }


    public render(shader: Shader, projection : Matrix4x4, viewMatrix : Matrix4x4): void {
        this._sprite.draw(shader, this.owner.worldMatrix, projection, viewMatrix);

        super.render(shader, projection, viewMatrix);
    }
}


