import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class NodeCollectionStore extends NodeStore {

    @observable
    public nodes: NodeStore[] = new Array<NodeStore>();

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px," + this.y + "px)"; // for CSS transform property
    }

    @action
    public addNodes(stores: NodeStore[]): void {
        stores.forEach(store => {
            store.parent = this;
            this.nodes.push(store);
        })
    }

    // functionality to remove a node from a collection
    @action
    removeNode(node: NodeStore) {
        this.nodes = this.nodes.filter(n => n !== node);
        node.parent = null;
    }

}