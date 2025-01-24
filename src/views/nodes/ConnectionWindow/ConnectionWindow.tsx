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
 * Method that determines color of connection window based on the type of node it is being added to
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
        return "#ccc";
    }
  };

/**
 * A class representing the connection window (a panel attached to each node displaying
 * a list of nodes that the current node is connected/linked to). The window comprises a list
 * of buttons representing individual connections. Each time a button corresponding to a 
 * certain "connected" node is pressed, the user's view shifts (i.e. the canvas pans) to take them
 * to where the connected node is -- i.e., "following" a connection.
 */

@observer
export class ConnectionWindow extends React.Component<ConnectionWindowProps> {

  /**
   * Method for when the "connect" button is dragged from its place
   * @param e -- the event of the drag starting
   */
  
  @action dragStart = (e: React.DragEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.dataTransfer.setData("text/plain", this.props.store.Id); // stores the current node id
      e.dataTransfer.effectAllowed = "move";
  }

  /**
   * Method for when the "connect" button is dropped
   * @param e -- event for button being dropped
   */
  @action drop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const sourceId = e.dataTransfer.getData("text/plain"); // gets the current node id
      const targetId = this.props.store.Id; // the target node id

      nodeService.connectNodes(sourceId, targetId);
  }

  /**
   * Method for when the drag event completes
   * @param e -- event that drag completes
   */

  @action allowDrop = (e: React.DragEvent) => {
      e.preventDefault();
  }

  /**
   * Method for handling a click on the button representing a connection to a particular node
   * @param nodeId -- the id of the connected node
   */

  @action nodeClick = (nodeId: string) => {
    this.props.onCenterNode(nodeId);
    // Calls the function to center the corresponding node when the button is clicked
  }

  /**
   * Method for handling a click on the "x" (delete) button next to each connection button
   * -- i.e. to delete that connection
   * @param target -- the target node (the node that the connection button refers to)
   */

  @action deleteConnection = (target: NodeStore) => {
    const sourceId = this.props.store.Id;
    const targetId = target.Id;
    nodeService.disconnectNodes(sourceId, targetId);
    this.props.store.removeConnection(target);
  }

  /**
   * Method to render the connection window
   * @returns -- nothing, if the connection window is not yet open 
   * (can be opened by the + button at top left of each node)
   */

  public render() {
      const { store } = this.props;
      if (!store.areConnectionsVisible) return null; // returns if connections window not open

      const backgroundColor = getColorForNodeType(store.type);
      const backgroundSolidColor = backgroundColor.slice(0,7); // removes the transparency
      return (
          <div className="connection-window"
                onDrop={this.drop} 
                onDragOver={this.allowDrop}
                style={{ position: 'absolute', right: '100%', top: 0, backgroundColor: backgroundColor, height: store.height}}>
              <ul className="connection-list">
                  {store.connections.map(node => (
                      <li key={node.Id}>
                        <div className="connection-buttons">
                          {/** button to follow a connection */}
                          <button onClick={() => this.nodeClick(node.Id)}>
                            {node.title || "Untitled Node"} {/** Button says the connected node's title, and "Untitled Node" if a title doesn't exist */}
                          </button>
                          {/** button to delete the connection */}
                          <button 
                            onClick={() => this.deleteConnection(node)}>
                              &times;
                          </button>
                        </div>
                      </li>
                  ))}
              </ul>
              {/** button to create a connection. To connect, click and drag this
               * button to another node's connection window */}
              <button className="connect-drag-button" draggable onDragStart={this.dragStart}
              style={{backgroundColor: backgroundSolidColor}}>
                Drag & Connect !
              </button>
          </div>
        );
    }
}