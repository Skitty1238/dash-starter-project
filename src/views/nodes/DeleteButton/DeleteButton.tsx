import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import "./DeleteButton.scss"

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
            store.parent.removeNode(store);
        }
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
