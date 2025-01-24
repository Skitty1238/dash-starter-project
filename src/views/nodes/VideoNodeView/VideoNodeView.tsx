import { observer } from "mobx-react";
import * as React from 'react';
import { VideoNodeStore } from "../../../stores";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./VideoNodeView.scss";
import { ConnectionWindow } from "../ConnectionWindow";
import { action } from "mobx";

interface VideoNodeProps {
    store: VideoNodeStore;
    onCenterNode: (nodeId: string) => void;
    
}

/**
 * Class representing frontend of Video Node
 */

@observer
export class VideoNodeView extends React.Component<VideoNodeProps> {

    /**
     * toggles the areConnectionsVisible field of the node (used to show/hide the connections window)
     */
    @action toggleConnections = () => {
        this.props.store.areConnectionsVisible = !this.props.store.areConnectionsVisible
    }
    
    /**
     * Renders a Video Node
     * @returns -- HTML div element representing a Video Node
     */

    render() {
        let {store} = this.props;

        return (
            <div className="node-container" style={{
                transform: store.transform,
                position: 'absolute',
                width: `${store.width}px`,
                height: `${store.height + 10}px`}}>
                <div className="node videoNode" style={{
                        width: '100%',
                        height: '100%'
                        }}>
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <div className="content">
                            <h3 className="title">{store.title}</h3>
                            <video src={store.url} controls />
                        </div>
                    </div>
                    <ResizeBox store={store}/>
                </div>
                <button className="video-connections-button" onClick={this.toggleConnections}>+</button>
                <ConnectionWindow store={store} onCenterNode={this.props.onCenterNode}/>
            </div>
        );
    }
}