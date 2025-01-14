import { computed, observable, action } from "mobx";
import { Utils } from "../Utils";

export enum StoreType {
    Text, 
    Video,
    FormattableText,
    Image,
    Web
}

export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType | null = null;

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = 300; // default width (pixels)

    @observable
    public height: number = 300; // default height (pixels)

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }

}