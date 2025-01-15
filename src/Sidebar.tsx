import React from 'react';
import { observer } from "mobx-react";
import './Sidebar.scss';
import { NodeStore, NodeCollectionStore } from './stores';

interface NodeItemProps {
    node: NodeStore;
    level?: number;
}

const NodeItem: React.FC<NodeItemProps> = ({ node, level = 0 }) => {
    const paddingLeft = 20 * (level || 0);
    return (
        <div className="node-item" style={{ paddingLeft: `${paddingLeft}px` }}>
            {node.title}
            {'nodes' in node && (node as NodeCollectionStore).nodes.map(child => (
                <NodeItem key={child.Id} node={child} level={(level || 0) + 1} />
            ))}
        </div>
    );
};

interface SidebarProps {
    store: NodeCollectionStore;
}

const Sidebar: React.FC<SidebarProps> = observer(({ store }) => {
    return (
        <div className="sidebar">
            <div className="title"><h3>Node Hierarchy</h3></div>
            {store.nodes.map(node => (
                <NodeItem key={node.Id} node={node} />
            ))}
        </div>
    );
});

export default Sidebar;
