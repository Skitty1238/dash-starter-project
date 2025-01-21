// ConnectionPoint.tsx
import React from 'react';
import { observer } from "mobx-react";
import { NodeCollectionStore, NodeStore, StoreType } from '../../../stores';
import { ImageNodeStore } from '../../../stores/ImageNodeStore';
import "./ConnectionWindow.scss"
import { action } from 'mobx';

interface ConnectionWindowProps {
    store: NodeStore;
    mainStore: NodeCollectionStore;
}

/**
 * Method that determines color of top bar based on the type of node it is being added to
 * @param type -- type of the node being rendered
 * @returns -- a string representing a color for the given node
 */
const getColorForNodeType = (type: StoreType | null | undefined) => {
    switch (type) {
      case StoreType.Text:
        return "#aa6da359"; 
      case StoreType.Video:
        return "#7c709e59"; 
      case StoreType.Image:
        return "#4d729859";
      case StoreType.Web:
        return "#be8a6659"; 
      case StoreType.FormattableText:
        return "#aa6f7759";
      case StoreType.Collection:
        return "#17161459"; 
      default:
        return '#ccc';
    }
  };

@observer
export class ConnectionWindow extends React.Component<ConnectionWindowProps> {
    @action dragStart = (e: React.DragEvent<HTMLButtonElement>) => {
        e.dataTransfer.setData("text/plain", this.props.store.Id);
        e.dataTransfer.effectAllowed = "move";
    }

    @action drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData("text/plain");
        const targetStore = this.props.store;
        const sourceStore = this.props.mainStore.findNodeById(sourceId);

        if (sourceStore && targetStore !== sourceStore) {
            targetStore.addConnection(sourceStore);
            sourceStore.addConnection(targetStore);
        }
    }

    @action allowDrop = (e: React.DragEvent) => {
        e.preventDefault();
    }

    render() {
        const { store } = this.props;
        if (!store.areConnectionsVisible) return null;

        const backgroundColor = getColorForNodeType(store.type);
        return (
            <div className="connection-window"
                 onDrop={this.drop} 
                 onDragOver={this.allowDrop}
                 style={{ position: 'absolute', right: '100%', top: 0, backgroundColor: backgroundColor, height: store.height}}>
                <ul>
                    {store.connections.map(node => (
                        <li key={node.Id}>
                            {node.title || "Untitled Node"}
                        </li>
                    ))}
                </ul>
                <button draggable onDragStart={this.dragStart}>Drag to connect</button>
            </div>
        );
    }
}