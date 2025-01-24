import { observer } from "mobx-react";
import * as React from 'react';
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./ImageNodeView.scss";
import { ConnectionWindow } from "../ConnectionWindow";
import { action } from "mobx";

interface ImageNodeProps {
    store: ImageNodeStore;
    onCenterNode: (nodeId: string) => void;
}

/**
 * A class representing the Image Node frontend
 */

@observer
export class ImageNodeView extends React.Component<ImageNodeProps> {

    /**
     * toggles the areConnectionsVisible field of the node (used to show/hide the connections window)
     */
    @action toggleConnections = () => {
        this.props.store.areConnectionsVisible = !this.props.store.areConnectionsVisible
    }

    /**
     * Renders the Image Node
     * @returns -- an HTML div element representing an Image Node
     */
    public render() {
        const { store } = this.props;
        return (
            <div className="node-container" style={{
                transform: store.transform,
                position: 'absolute',
                width: `${store.width}px`,
                height: `${store.height + 10}px` // adjusted height to accommodate connection window
            }}
            >
                
                <div className="node imageNode" style={{
                        width: '100%',
                        height: '100%'}} 
                        >
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <div className="content">
                            <h3 className="title">{store.title}</h3>
                            <img src={store.imageUrl} alt={store.title}/> {/** stores image url */}
                        </div>
                    </div>
                    <ResizeBox store={store}/>
                </div>
                <button className="image-connections-button" onClick={this.toggleConnections}>+</button>
                <ConnectionWindow store={store} onCenterNode={this.props.onCenterNode}/>
            </div>
        );
    }
}