import { computed, observable, action } from "mobx";
import { Utils } from "../Utils";
import { NodeCollectionStore } from "./NodeCollectionStore";

export enum StoreType {
    Text, 
    Video,
    FormattableText,
    Image,
    Web,
    Collection
}

/**
 * A class containing data that all nodes must have
 */
export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType | null = null;

    @observable
    public title: string = "";

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = 300; // default width

    @observable
    public height: number = 300; // default height

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }

    @observable 
    public parent: NodeCollectionStore | null = null;
    // represents the collection under which the node lies

}