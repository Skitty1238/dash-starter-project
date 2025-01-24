import React from 'react';
import { observer } from "mobx-react";
import { NodeStore, StoreType } from '../../../stores';
import "./ConnectionWindow.scss"
import { action } from 'mobx';
import { nodeService } from '../../../NodeService';

interface ConnectionWindowProps {
    store: NodeStore;
    onCenterNode: (nodeId: string) => void;
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
        return "#8f8c8ccc"; 
      default:
        return '#ccc';
    }
  };

@observer
export class ConnectionWindow extends React.Component<ConnectionWindowProps> {
    @action dragStart = (e: React.DragEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", this.props.store.Id);
        e.dataTransfer.effectAllowed = "move";
    }

    @action drop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData("text/plain");
        const targetId = this.props.store.Id;

        nodeService.connectNodes(sourceId, targetId);

    }

    @action allowDrop = (e: React.DragEvent) => {
        e.preventDefault();
    }

    @action nodeClick = (nodeId: string) => {
      // Call the function to center the node when a button is clicked
      if (this.props.onCenterNode) { // REMOVE THIS IF STATEMENT LATER!
        this.props.onCenterNode(nodeId);
      }
    }

    @action deleteConnection = (target: NodeStore) => {
      const sourceId = this.props.store.Id;
      const targetId = target.Id;
      nodeService.disconnectNodes(sourceId, targetId);
      this.props.store.removeConnection(target);
    }

    render() {
        const { store } = this.props;
        if (!store.areConnectionsVisible) return null;

        const backgroundColor = getColorForNodeType(store.type);
        const backgroundSolidColor = backgroundColor.slice(0,7);
        return (
            <div className="connection-window"
                 onDrop={this.drop} 
                 onDragOver={this.allowDrop}
                 style={{ position: 'absolute', right: '100%', top: 0, backgroundColor: backgroundColor, height: store.height}}>
                <ul className="connection-list">
                    {store.connections.map(node => (
                        <li key={node.Id}>
                          <div className="connection-buttons">
                            <button onClick={() => this.nodeClick(node.Id)}>
                              {node.title || "Untitled Node"}
                            </button>
                            <button 
                              onClick={() => this.deleteConnection(node)}>
                                &times;
                            </button>
                          </div>
                        </li>
                    ))}
                </ul>
                <button className="connect-drag-button" draggable onDragStart={this.dragStart}
                style={{backgroundColor: backgroundSolidColor}}>
                  Drag & Connect !
                </button>
            </div>
        );
    }
}