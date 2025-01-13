import { computed, observable, action } from "mobx";
import { Utils } from "../Utils";

export enum StoreType {
    Text, 
    Video,
    FormattableText
}

export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType | null = null;

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = 300;

    @observable
    public height: number = 300;

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }

    @action
    setDimensions(newWidth: number, newHeight: number) {
        this.width = Math.max(newWidth, 50);
        this.height = Math.max(newHeight, 50);
    }

    @action
    setPosition(newX: number, newY: number) {
        this.x = newX;
        this.y = newY;
    }
}