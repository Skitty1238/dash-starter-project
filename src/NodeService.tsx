import { NodeCollectionStore, NodeStore } from "./stores";
import { observable, action } from "mobx";

/**
 * Class to handle interactions between nodes (and any necessary functions nodes may need)
 * -- mostly for node connection functionality
 */

export class NodeService {
    // map of any and all nodes' ids in the app to their actual node objects
    @observable private nodes: Map<string, NodeStore> = new Map();

    /**
     * Method to add a node into the service (i.e. create a new node in the app)
     * @param node -- the node to add
     */
    @action addNode(node: NodeStore): void {
        if (!this.nodes.has(node.Id)) {
            this.nodes.set(node.Id, node);
        }
    }

    /**
     * Method to find a node given its id
     * @param id -- the node's id
     * @returns -- the corresponding node, if there is one (else undefined)
     */

    public findNodeById(id: string): NodeStore | undefined {
        return this.nodes.get(id);
    }

    /**
     * Method to connect two nodes
     * @param sourceId -- the id of the source of the connection (i.e. the node on which the connect button was dragged)
     * @param targetId -- the id of the target of the connection (i.e. the node on which the connect button was dropped)
     */

    @action connectNodes(sourceId: string, targetId: string): void {
        const sourceNode = this.findNodeById(sourceId);
        const targetNode = this.findNodeById(targetId);

        if (sourceNode && targetNode && sourceNode !== targetNode) { // cannot connect node to itself
            sourceNode.addConnection(targetNode);
            targetNode.addConnection(sourceNode);
            // addConnection deals with duplicate adds (does nothing in that case)
        }
    }

    /**
     * Method to delete a connection between 2 nodes
     * @param sourceId -- the id of the source node of the connection
     * @param targetId -- the id of the target node of the connection
     */

    @action disconnectNodes(sourceId: string, targetId: string): void { 
        const sourceNode = this.findNodeById(sourceId);
        const targetNode = this.findNodeById(targetId);
        if (sourceNode && targetNode) {
            sourceNode.removeConnection(targetNode);
            targetNode.removeConnection(sourceNode);
        }
    }

    /**
     * Method to find the topmost parent (collection node) of a given node, excluding the main canvas
     * @param node -- the node to find the topmost parent for
     * @returns -- the collection node that is the topmost parent, or null, 
     * if the node lies directly in the main canvas (not in a collection)
     */
    public getTopMostParent(node: NodeStore): NodeCollectionStore | null {
        let currentParent = node.parent;
        let topMost = null;

        while (currentParent?.parent) {
            topMost = currentParent;
            currentParent = currentParent.parent;
        }

        return topMost;
    }

    /**
     * Method that finds the parental path up to the root node for a given a node ID,
     * 
     * @param nodeId - The id of the node to start from.
     * @returns An array of nodes representing the path from the top-level parent (collection) to the node.
     */
    public getParentalPath(nodeId: string): NodeStore[] {
        const path: NodeStore[] = [];
        let currentNode = this.findNodeById(nodeId);

        // traverses up until there is no parent
        while (currentNode) {
            path.unshift(currentNode); // adds to the front (so path is top to bottom)
            if (currentNode.parent && currentNode.parent.parent) {currentNode = currentNode.parent} else {currentNode = undefined};
            // excludes the topmost parent (since that is always the freeform canvas)
        }

        return path;
    }

    /**
     * Method that returns an array of all starred nodes in the app
     * @returns -- an array of all starred nodes in the app
     */

    public starredNodes(): NodeStore[] {
        return Array.from(this.nodes.values()).filter(node => node.isStarred);

    }
}

export const nodeService = new NodeService();
