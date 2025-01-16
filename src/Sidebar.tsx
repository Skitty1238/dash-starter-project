// A sidebar to represent an alternate way of organizing nodes in collections.
// Appears like a hierarchical list or file directory. That is, nodes within a collection node are 
// indented once, nodes in a nested collection (a collection in a collection) are indented twice, etc.
// A collection's "child" nodes always appear directly under it, and are indented one level
// more than the collection node itself.

// The sidebar also has drag/drop functionality for each node that functions as follows:
// - if you click on a node in the sidebar and drag it to the title portion of 
//      a collection node in the sidebar, the node will be added to that collection 
//      (and the UI will update accordingly)
// -  if you click on any nested node in the sidebar and drag it to the right side of 
//      the sidebar, the node will move to the main collection (i.e. the freeform 
//      canvas), and the UI will update accordingly

import React from 'react';
import { observer } from "mobx-react";
import './Sidebar.scss';
import { NodeStore, NodeCollectionStore } from './stores';

interface NodeItemProps {
    node: NodeStore;
    level?: number; // represents level of indentation (or the depth in the node hierarchy)
    onMoveNode: (nodeId: string, newParentId?: string) => void; // function to handle moving nodes
}

const NodeItem: React.FC<NodeItemProps> = ({ node, level = 0, onMoveNode}) => {
    const paddingLeft = 20 * (level || 0); 
        // Incremental padding to represent depth of hierarchy
    const isCollection = 'nodes' in node; 
        // NodeCollectionStore is the only store to have a field called "nodes", 
        // so this works to identify a node as a collection node 

    // Drag and drop functionality
    const dragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData("text/plain", node.Id);
        e.stopPropagation();
    };

    const drop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nodeId = e.dataTransfer.getData("text/plain");
        if (nodeId && isCollection) { // drops node only in collection nodes
            onMoveNode(nodeId, node.Id);
        }
    };

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
            style={{ paddingLeft: `${paddingLeft}px` }}
        >
            {node.title || "No Title"}
            {(isCollection) && (node as NodeCollectionStore).nodes.map(child => (
                <NodeItem key={child.Id} node={child} level={(level || 0) + 1} onMoveNode={onMoveNode}/>
                // child nodes have 1 level more of indentation
            ))}
        </div>
    );
};

interface SidebarProps {
    store: NodeCollectionStore;
    onMoveNode: (nodeId: string, newParentId?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = observer(({ store, onMoveNode }) => {

    // handles dropping on the sidebar itself (i.e. to move nodes to the main collection)
    const drop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const nodeId = e.dataTransfer.getData("text/plain");
        onMoveNode(nodeId); // Passing undefined as newParentId (will default to the main canvas)
    };

    // Recursive rendering of nodes and child nodes
    const renderNodes = (nodes: NodeStore[], level: number = 0) => {
        return nodes.map(node => {
            const isCollection = 'nodes' in node; // Check if this is a collection node
            const childrenCount = isCollection ? (node as NodeCollectionStore).nodes.length : 0;
            return (
                <NodeItem 
                    key={`${node.Id}-${childrenCount}`} // Use children count for collections only
                    node={node} 
                    level={level} 
                    onMoveNode={onMoveNode} 
                />
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