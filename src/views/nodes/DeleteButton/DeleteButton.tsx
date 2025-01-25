import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import "./DeleteButton.scss"
import { nodeService } from "../../../NodeService";

interface DeleteButtonProps {
    store: NodeStore;
}

/**
 * A class representing the delete button on each node that removes the node completely
 */

@observer
export class DeleteButton extends React.Component<DeleteButtonProps> {

    /**
     * Method that deletes the given node by accessing its parent and 
     * removing the relevant node from the parent collection's array of nodes
     */

    private delete = () => {
        const { store } = this.props;
        if (store.parent) {
            store.connections.forEach(
                connection => nodeService.disconnectNodes(store.Id, connection.Id)) 
                // so that the nodes that are connected to the node being removed
                // are no longer connected
             
            store.parent.removeNode(store);
        }
        nodeService.removeNode(store.Id);
    };

    /**
     * Method that renders the delete button
     * @returns -- an HTML button element
     */
    public render() {
        return (
            <button className="delete-button" onClick={this.delete}>
                &times;
            </button>
        );
    }
}
