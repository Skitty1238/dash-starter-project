import { computed, observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { nodeService } from "../NodeService";

/**
 * A class for the information stored in a collection node
 */


export class NodeCollectionStore extends NodeStore {

    /**
     * Constructor for Collection Node Store
     * @param initializer -- the object to initialize
     */

    constructor(initializer: Partial<NodeCollectionStore>) {
        super();
        Object.assign(this, initializer);
    }
    
    @observable
    public nodes: NodeStore[] = new Array<NodeStore>();
    // array of nodes (children) within the collection

    /**
     * Method to transform the node
     */
    @computed
    public get transform(): string {
        return "translate(" + this.x + "px," + this.y + "px)"; // for CSS transform property
    }

    /**
     * Method to add an array of nodes to the node colleiton
     * @param stores - the child nodes to add to the collection
     */
    @action
    public addNodes(stores: NodeStore[]): void {
        stores.forEach(store => {
            if (!this.nodes.includes(store)) {
                store.parent = this;
                this.nodes.push(store)
                nodeService.addNode(store);}
        })
    }

    /**
     * Method to remove a node from a collection
     * @param node -- the node to remove
     */
    @action
    public removeNode(node: NodeStore) {
        this.nodes = this.nodes.filter(n => n !== node); // filters this.nodes to include everything except the node to remove
        node.parent = null;
    }

    
    @observable
    public isModalOpen = false;
    // boolean representing whether the modal (node creation form) is open or not

    /**
     * Method to center a given node in a collection (or nested collection) by "panning" inside 
     * each collection recursively until the given node appears in the center
     * @param nodeId -- the id of the node to ultimately center
     */

    @action
    public centerOnNode = (nodeId: string) => {
        const nodePath = nodeService.getParentalPath(nodeId); // gets the parental path 
        if (nodePath.length > 0) {
            // revrse parental path to start centering from the outermost parent
            nodePath.reverse().forEach((node, index) => {
                if (index < nodePath.length - 1) { // Check if there is a parent to center within
                    const parentNode = nodePath[index + 1];
                    this.centerNodeInParent(node, parentNode);
                }
            });
        }
    }

    /**
     * Method to center a given node in its given parent collection node
     * @param node - the node to center
     * @param parent - the parent collection of the node
     */

    @action
    private centerNodeInParent = (node: NodeStore, parent: NodeStore) => {
        if (parent instanceof NodeCollectionStore) {
            // offset needed to center the node
            const offsetX = (parent.width / 2) - (node.x + node.width / 2);
            const offsetY = (parent.height / 2) - (node.y + node.height / 2);

            // moves all nodes within the parent equally (i.e. "pans" inside the collection)
            parent.nodes.forEach(child => {
                child.x += offsetX;
                child.y += offsetY;
            });
        }
    }


}