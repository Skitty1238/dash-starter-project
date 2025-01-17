import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import './ResizeBox.scss';

interface ResizeBoxProps {
    store: NodeStore;
}

/**
 * A class representing a reize box that allows for resize functionality of corresponding node
 */

@observer
export class ResizeBox extends React.Component<ResizeBoxProps> {
    private isResizing = false; // whether the node is currently being resized or not
    private initialPos = { x: 0, y: 0 };
    private initialSize = { width: 0, height: 0 };

    /**
     * Method handling event where mouse is clicked on the resize box
     * @param e -- event where mouse is clicked on the resize box
     */
    private pointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isResizing = true;
        this.initialPos = { x: e.clientX, y: e.clientY }; // stores initial position of the pointer (as soon as click takes place)
        this.initialSize = {
            width: this.props.store.width,
            height: this.props.store.height
        }; // stores initial size of the node (as soon as click takes place)

        // deals with events of click-and-drag (pointer move), or the click ending (pointer up)
        document.addEventListener("pointermove", this.pointerMove);
        document.addEventListener("pointerup", this.pointerUp);
    };

    /**
     * Method handling event where mouse is clicked on resize box and dragged 
     * @param e -- event where mouse is clicked and dragged
     * @returns -- if the resizing ceases (i.e. when click is released)
     */
    private pointerMove = (e: PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isResizing) return; 
        // if resize is no longer happening (i.e. the click ends if the pointer is up),
        // then the method will return automatically (so no change happens)
        
        // stores change in x,y position of the pointer since the click began
        const changeX = e.clientX - this.initialPos.x;
        const changeY = e.clientY - this.initialPos.y;

        // calculates new width and height based on pointer movement
        // minimum width and height of 50 to prevent node from becoming too small to access
        const newWidth = Math.max(this.initialSize.width + changeX, 50);
        const newHeight = Math.max(this.initialSize.height + changeY, 50);

        // set dimensions to new width and height
        this.props.store.width = newWidth;
        this.props.store.height = newHeight;
    };

    /**
     * Method handling when click is released from resize box
     * @param e -- event of mouse click being released from resize box
     */

    private pointerUp = (e: PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.isResizing = false;

        // event listeners removed to prevent further changes in size
        document.removeEventListener("pointermove", this.pointerMove);
        document.removeEventListener("pointerup", this.pointerUp);
    };

    /**
     * Method that renders the resize box
     * @returns -- an HTML div element representing the resize box
     */
    public render() {
        return (
            <div
                className="resize-box"
                onPointerDown={this.pointerDown}
            />
        );
    }
}
