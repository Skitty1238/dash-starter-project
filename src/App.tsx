import React from 'react';
import './App.scss';
import { NodeCollectionStore } from './stores';
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';
import 'react-quill/dist/quill.snow.css';
import { Sidebar } from "./Sidebar";
import NodeModal from './NodeModal';
import { nodeService } from './NodeService';

const mainNodeCollection = new NodeCollectionStore({}); // represents the main canvas

/**
 * Class represnenting the main App housing all the interactive elements
 */

export class App extends React.Component {

    /**
     * Method that opens the modal element (form) when the add node (+) button is clicked
     */
    private addButtonClick = () => {
        mainNodeCollection.isModalOpen = true;
    }

    /**
     * Method that handles when nodes are moved to/from/between collections
     * @param nodeId -- the id of the node to move
     * @param newParentId -- the id of the new parent the node is being moved to
     * @returns -- if the node is somehow moved to itself (i.e. you try and move a collection to itself)
     */
    private onMoveNode = (nodeId: string, newParentId?: string) => {

        // find current node and its parent
        const nodeToMove = nodeService.findNodeById(nodeId);
        const newParentNode = newParentId ? nodeService.findNodeById(newParentId) as NodeCollectionStore : mainNodeCollection;

        if (nodeId === newParentId) {
            return; // prevent moving the node to itself (wouldn't make sense)
        }
    
        if (nodeToMove && newParentNode && nodeToMove.parent !== newParentNode) { 

            // remove node from its current parent collection 
            if (nodeToMove.parent) {
                nodeToMove.parent.removeNode(nodeToMove);
            }

            // add the node to the new parent collection
            newParentNode.addNodes([nodeToMove]);
            nodeToMove.parent = newParentNode;

            // move the node to the center of the collection node it has been added to, 
            // so that it is instantly visible 
            if (newParentNode !== mainNodeCollection) {
                nodeToMove.x = (newParentNode.width / 2) - (nodeToMove.width / 2);
                nodeToMove.y = (newParentNode.height / 2) - (nodeToMove.height / 2);
            }
            
        } else if (nodeToMove && !newParentNode && nodeToMove.parent !== newParentNode) { 
            // handles moving node into the main collection
            if (nodeToMove.parent) {
                nodeToMove.parent.removeNode(nodeToMove);
            }

            mainNodeCollection.addNodes([nodeToMove]);
        }
    }

    /**
     * Renders the app
     * @returns -- HTML div element encapsulating the App UI 
     */

    public render() {
        return (
            <div className="App" id="canvas">
            
            <FreeFormCanvas store={mainNodeCollection}/> {/** the main canvas */}
            <Sidebar store={mainNodeCollection} onMoveNode={this.onMoveNode}/> {/** the sidebar (node hierarchy view) */}
            <button className="add-node-button" onClick={this.addButtonClick}>+</button> {/** add node button */}
            {<NodeModal store={mainNodeCollection}/>} {/** add node form (modal) */}
            </div>
        );
    }
}

export default App;