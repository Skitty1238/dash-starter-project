import { NodeCollectionStore, NodeStore } from "./stores";
import { observable, action } from "mobx";

export class NodeService {
    @observable private nodes: Map<string, NodeStore> = new Map();

    @action addNode(node: NodeStore): void {
        if (!this.nodes.has(node.Id)) {
            this.nodes.set(node.Id, node);
        }
    }

    public findNodeById(id: string): NodeStore | undefined {
        return this.nodes.get(id);
    }

    @action connectNodes(sourceId: string, targetId: string): void {
        const sourceNode = this.findNodeById(sourceId);
        const targetNode = this.findNodeById(targetId);

        if (sourceNode && targetNode && sourceNode !== targetNode) {
            sourceNode.addConnection(targetNode);
            targetNode.addConnection(sourceNode);
        }
    }

    @action disconnectNodes(sourceId: string, targetId: string): void {
        const sourceNode = this.findNodeById(sourceId);
        const targetNode = this.findNodeById(targetId);
        if (sourceNode && targetNode) {
            sourceNode.removeConnection(targetNode);
            targetNode.removeConnection(sourceNode);
        }
    }
    

    getTopMostParent(node: NodeStore): NodeCollectionStore | null {
        // let currentParent = node.parent;
        // while (currentParent?.parent) {
        //   currentParent = currentParent.parent;
        // }
        // if (currentParent) {return currentParent} else {return null}; // This could be undefined if no parent, or the topmost parent\

        let currentParent = node.parent;
        let topMost = null;

        while (currentParent?.parent) {
            topMost = currentParent;
            currentParent = currentParent.parent;
        }

        return topMost;
    }
    // technically gets the 2nd topmost parent

    /**
     * Given a node ID, finds its parental path up to the root node.
     * 
     * @param nodeId - The ID of the node to start from.
     * @param nodeStore - The top-level node store or collection store.
     * @returns An array of nodes representing the path from the top-level parent to the node.
     */
    public getParentalPath(nodeId: string): NodeStore[] {
        const path: NodeStore[] = [];
        let currentNode = this.findNodeById(nodeId);

        // Traverse up the tree until there is no parent
        while (currentNode) {
            path.unshift(currentNode); // Add to the front to build the path from top to bottom
            if (currentNode.parent) {currentNode = currentNode.parent} else {currentNode = undefined};
        }

        return path;
    }
    



}

export const nodeService = new NodeService();
