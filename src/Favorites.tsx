import React from 'react';
import { observer } from "mobx-react";
import { NodeCollectionStore, NodeStore, StoreType } from './stores';
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
     * Method to get the type of a node in string format
     * @param type -- the input type of a node
     * @returns -- its corresponding string version
     */
    private getType(type: StoreType | null): string {
        switch (type) {
            case StoreType.Text:
                return "Text";
            case StoreType.Video:
                return "Video";
            case StoreType.Image:
                return "Image";
            case StoreType.Web:
                return "Web";
            case StoreType.FormattableText:
                return "Formattable Text";
            case StoreType.Collection:
                return "Collection";
            default:
                return "";
        };
    }

    /**
     * Renders the favorites panel component
     * @returns -- an HTML div element representing the favorites panel
     */
    public render() {
        const { store } = this.props;
        const starredNodes = nodeService.starredNodes // retrieves an array of all starred nodes in the app

        return (
            <div className="favorites-panel">
                
                {starredNodes.map(node => (
                    <button key={node.Id} 
                    onClick={() => this.props.onCenterNode(node.Id)} /** center the node on the screen if its corresponding star is clicked */
                    title={`Title: ${node.title || "Unnamed Node"}, Type: ${this.getType(node.type)}`}> {/** Show title and type on hover */}
                    ★
                    </button>
                    
                ))}
            </div>
        );
    }
}
