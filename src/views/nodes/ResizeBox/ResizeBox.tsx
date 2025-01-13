import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore } from "../../../stores";
import './ResizeBox.scss';

interface ResizeBoxProps {
    store: NodeStore;
}

@observer
export class ResizeBox extends React.Component<ResizeBoxProps> {
    private isResizing = false;
    private initialPos = { x: 0, y: 0 };
    private initialSize = { width: 0, height: 0 };

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isResizing = true;
        this.initialPos = { x: e.clientX, y: e.clientY };
        this.initialSize = {
            width: this.props.store.width,
            height: this.props.store.height
        };

        document.addEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointerup", this.onPointerUp);
    };

    onPointerMove = (e: PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isResizing) return;
        
        const changeX = e.clientX - this.initialPos.x;
        const changeY = e.clientY - this.initialPos.y;

        const newWidth = Math.max(this.initialSize.width + changeX, 50);
        const newHeight = Math.max(this.initialSize.height + changeY, 50);
        this.props.store.setDimensions(newWidth, newHeight);
    };

    onPointerUp = (e: PointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.isResizing = false;

        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    };

    render() {
        return (
            <div
                className="resize-box"
                onPointerDown={this.onPointerDown}
            />
        );
    }
}
