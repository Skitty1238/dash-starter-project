import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore, VideoNodeStore } from "../../../stores";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./VideoNodeView.scss";
import { ConnectionWindow } from "../ConnectionWindow";

interface VideoNodeProps {
    store: VideoNodeStore;
    mainStore: NodeCollectionStore;
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
        let {store, mainStore} = this.props;

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
                <ConnectionWindow store={store} mainStore={mainStore}/>
            </div>
        );
    }
}