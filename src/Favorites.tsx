import React from 'react';
import { observer } from "mobx-react";
import { NodeCollectionStore, NodeStore } from './stores';
import "./Favorites.scss"
import { observable } from 'mobx';
import { nodeService } from './NodeService';

interface FavoritesProps {
    store: NodeCollectionStore; // the main store
    onCenterNode: (nodeId: string) => void;
}

/**
 * A class representing a favorites panel, containing buttons that 
 * take you directly to "starred" nodes by panning the canvas
 */

@observer
export class Favorites extends React.Component<FavoritesProps> {

    /**
     * Renders the favorites panel component
     * @returns -- an HTML div element representing the favorites panel
     */
    render() {
        const { store } = this.props;
        const starredNodes = nodeService.starredNodes() // gets an array of all starred nodes in the app

        return (
            <div className="favorites-panel">
                
                {starredNodes.map(node => (
                    <button key={node.Id} onClick={() => this.props.onCenterNode(node.Id)}> {/** center the node on the screen if its corresponding star is clicked */}
                    ★
                    </button>
                ))}
            </div>
        );
    }
}
