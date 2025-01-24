/** A sidebar represents an alternate way of organizing nodes in collections.
Appears like a hierarchical list or file directory. That is, nodes within a collection node are 
indented once, nodes in a nested collection (a collection in a collection) are indented twice, etc.
A collection's "child" nodes always appear directly under it, and are indented one level
more than the collection node itself.

The sidebar also has drag/drop functionality for each node that functions as follows:
- if you click on a node in the sidebar and drag it to the title portion of 
     a collection node in the sidebar, the node will be added to that collection 
     (and the UI will update accordingly)
-  if you click on any nested node in the sidebar and drag it to the right side of 
     the sidebar, the node will move to the main collection (i.e. the freeform 
     canvas), and the UI will update accordingly

*/

import React from 'react';
import { observer } from "mobx-react";
import './Sidebar.scss';
import { NodeStore, NodeCollectionStore } from './stores';
import { observable } from 'mobx';

interface NodeItemProps {
    node: NodeStore;
    level?: number; // represents level of indentation (or the depth in the node hierarchy)
    onMoveNode: (nodeId: string, newParentId?: string) => void; // function to handle moving nodes within the sidebar
}

/**
 * Represents an invidual node "item" that appears in the sidebar, 
 * representing its corresponding node in the main freeform canvas UI
 * @returns -- an HTML div element represnting the Node Item, appearing as the given node's title
 */

const NodeItem: React.FC<NodeItemProps> = ({ node, level = 0, onMoveNode}) => {
    const paddingLeft = 20 * (level || 0); 
        // Incremental padding to represent depth of hierarchy
    const isCollection = ('nodes' in node); 
        // NodeCollectionStore is the only store to have a field called "nodes", 
        // so this works to identify a node as a collection node 
        
        
    // Drag and drop functionality

    /**
     * Method to handle event when a Node Item is clciked and dragged from its place in the sidebar
     * @param e -- event where Node Item is dragged
     */
    const dragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", node.Id);
        e.stopPropagation();
    };

    /**
     * Method to handle event when a dragged Node Item is dropped (i.e. the click is released)
     * Determines if the dropped node item should be added to a collecton based on where it is dropped
     * @param e -- event where click on Node Item is released after dragging it
     */

    const drop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nodeId = e.dataTransfer.getData("text/plain");
        if (nodeId && isCollection) { // for dropping in a collection node
            onMoveNode(nodeId, node.Id);
        }
    };

    /**
     * Allows drop event to occur by preventing default behaviour
     * @param e -- the drop event
     */

    const allowDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className={`node-item ${isCollection ? "node-item-collection" : ""}`}
            draggable
            onDragStart={dragStart}
            onDrop={drop}
            onDragOver={allowDrop}
            style={{ paddingLeft: `${paddingLeft}px` }} // hierarchical padding
        >
            {node.title || "No Title"}
            {(isCollection) && (node as NodeCollectionStore).nodes.map(child => (
                <NodeItem key={child.Id} node={child} level={(level || 0) + 1} onMoveNode={onMoveNode}/>
                // Recursively renders child nodes, which have 1 level more of indentation than their parents
            ))}
        </div>
    );
};

interface SidebarProps {
    store: NodeCollectionStore;
    onMoveNode: (nodeId: string, newParentId?: string) => void;
}

/**
 * Class that represents the Sidebar component displaying a hierarchical view of nodes. 
 * Nodes can be dragged and dropped into the main sidebar (representing the main canvas) too.
 */

export const Sidebar: React.FC<SidebarProps> = observer(({ store, onMoveNode }) => {

    /**
     * handles dropping on the sidebar itself (i.e. to move nodes to the main collection)
     * @param e -- drop event (of a particular Node Item that was dragged)
     */
    const drop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nodeId = e.dataTransfer.getData("text/plain");
        onMoveNode(nodeId); // Passes undefined as newParentId (defaults to the main canvas)
    };

    /**
     * Recursively renders Node Items and their child nodes 
     * @param nodes -- array of child nodes
     * @param level -- the hierarchy (indentation) level of the node item 
     * @returns -- the given Node Item(s) and any of their children, if they are collections
     */
    const renderNodes = (nodes: NodeStore[], level: number = 0) => {
        return nodes.map(node => {
            const isCollection = 'nodes' in node; // Check if this is a collection node
            const childrenCount = isCollection ? (node as NodeCollectionStore).nodes.length : 0; 
            // Counts children only for collection nodes (since other types of nodes cannot have children, so their count is 0)
            return (
                <div>
                <NodeItem 
                    key={`${node.Id}-${childrenCount}`} 
                    node={node} 
                    level={level} 
                    onMoveNode={onMoveNode} 
                />
                </div>
            );
        });
    };
    
    return (
        <div className="sidebar" onDrop={drop} onDragOver={(e) => e.preventDefault()}>
            <div className="title"><h3>Node Hierarchy</h3></div>
            {renderNodes(store.nodes)}
        </div>
    );
});