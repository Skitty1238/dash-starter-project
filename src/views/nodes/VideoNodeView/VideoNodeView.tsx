import { observer } from "mobx-react";
import * as React from 'react';
import { VideoNodeStore } from "../../../stores";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./VideoNodeView.scss";

interface VideoNodeProps {
    store: VideoNodeStore;
}

/**
 * Class representing frontend of Video Node
 */

@observer
export class VideoNodeView extends React.Component<VideoNodeProps> {
    
    /**
     * Renders a Video Node
     * @returns -- HTML div element representing a Video Node
     */

    render() {
        let store = this.props.store;

        return (
            <div className="node videoNode" style={{
                    transform: store.transform,
                    width: `${store.width}px`,
                    height: `${store.height}px`}}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.title}</h3>
                        <video src={store.url} controls />
                    </div>
                </div>
                <ResizeBox store={store}/>
            </div>
        );
    }
}