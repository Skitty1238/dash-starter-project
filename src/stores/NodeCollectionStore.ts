import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { nodeService } from "../NodeService";


export class NodeCollectionStore extends NodeStore {

    constructor(initializer: Partial<NodeCollectionStore>) {
        super();
        Object.assign(this, initializer);
    }

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
                this.nodes.push(store)
                nodeService.addNode(store);}
        })
    }

    // functionality to remove a node from a collection
    @action
    public removeNode(node: NodeStore) {
        this.nodes = this.nodes.filter(n => n !== node); // filters this.nodes to include everything except the node to remove
        node.parent = null;
    }

    // // breadth first search to return a partciular node (within collections) given its id
    // @observable
    // public findNodeById(id: string): NodeStore | undefined {
    //     let queue: (NodeStore | undefined)[] = [this];
    //     while (queue.length > 0) {
    //         const current = queue.shift();
    //         if (current?.Id === id) {
    //             return current;
    //         }
    //         if (current && 'nodes' in current) {
    //             queue.push(...(current as NodeCollectionStore).nodes);
    //         }
    //     }
    //     return undefined;
    // }

    @observable
    public isModalOpen = false;

    @action
    public centerOnNode = (nodeId: string) => {
        const nodePath = nodeService.getParentalPath(nodeId);
        console.log(nodeService.getParentalPath(nodeId));
        if (nodePath.length > 0) {
            // Reverse the path to start centering from the outermost parent
            nodePath.reverse().forEach((node, index) => {
                if (index < nodePath.length - 1) { // Ensure there is a parent to center within
                    const parentNode = nodePath[index + 1];
                    this.centerNodeInParent(node, parentNode);
                }
            });
        }
    }

    @action
    private centerNodeInParent = (node: NodeStore, parent: NodeStore) => {
        if (parent instanceof NodeCollectionStore) {
            // Calculate the offset needed to center this node in the parent
            const offsetX = (parent.width / 2) - (node.x + node.width / 2);
            const offsetY = (parent.height / 2) - (node.y + node.height / 2);

            // Adjust all nodes within the parent
            parent.nodes.forEach(child => {
                child.x += offsetX;
                child.y += offsetY;
            });
        }
    }


}