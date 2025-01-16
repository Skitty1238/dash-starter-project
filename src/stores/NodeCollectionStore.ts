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
            if (!this.nodes.includes(store)) {
                store.parent = this;
                this.nodes.push(store);}
        })
    }

    // functionality to remove a node from a collection
    @action
    removeNode(node: NodeStore) {
        this.nodes = this.nodes.filter(n => n !== node); // filters this.nodes to include everything except the node to remove
        node.parent = null;
    }

    // breadth first search to return a partciular node (within collections) given its id
    findNodeById(id: string): NodeStore | undefined {
        let queue: (NodeStore | undefined)[] = [this];
        while (queue.length > 0) {
            const current = queue.shift();
            if (current?.Id === id) {
                return current;
            }
            if (current && 'nodes' in current) {
                queue.push(...(current as NodeCollectionStore).nodes);
            }
        }
        return undefined;
    }

}