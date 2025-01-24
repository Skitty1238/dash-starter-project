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
    // represents the collection node under which the node lies

    @observable public connections: NodeStore[] = [];
    // represents the other nodes that the node is connected (linked) to

    /**
     * Method to add a connection (i.e. link a node)
     * @param node -- the node to link
     */

    @action addConnection(node: NodeStore) { 
        if (!this.connections.includes(node)) {
            this.connections.push(node);
        }
    }

    /**
     * Method to remove a connection
     * @param removeNode -- the node for which to remove the connection from the current node
     */

    @action removeConnection(removeNode: NodeStore) {
        this.connections = this.connections.filter(n => n.Id !== removeNode.Id);
    }

    @observable public areConnectionsVisible: boolean = false;
    // represents whether or not node's connection window is open

}