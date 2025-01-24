import React from 'react';
import { observer } from "mobx-react";
import { WebNodeStore } from "../../../stores/WebNodeStore";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./WebNodeView.scss";
import { ConnectionWindow } from '../ConnectionWindow';
import { action } from 'mobx';


interface WebNodeProps {
    store: WebNodeStore;
    onCenterNode: (nodeId: string) => void;
}

/**
 * Class representing frontend of Website Node
 */
@observer
export class WebNodeView extends React.Component<WebNodeProps> {

    // the iframe element that is embedded (stored) in the node
    private iframeRef: React.RefObject<HTMLIFrameElement> = React.createRef();

    /**
     * Function that updates the current iframe element of the node to the 
     * previous element, if there is one
     */
    private goBack = () => {
        if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
            this.iframeRef.current.contentWindow.history.back();
        }
    }

    /**
     * Function that updates the current iframe element of the node to the 
     * next element, if there is one
     */
    private goNext = () => {
        if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
            this.iframeRef.current.contentWindow.history.forward();
        }
    }

    /**
     * toggles the areConnectionsVisible field of the node (used to show/hide the connections window)
     */
    @action toggleConnections = () => {
        this.props.store.areConnectionsVisible = !this.props.store.areConnectionsVisible
    }

    /**
     * Renders the Web Node
     * @returns -- HTML div element representing a Web Node
     */

    public render() {
        let { store } = this.props;

        return (
            <div className="node-container" style={{
                transform: store.transform,
                position: 'absolute',
                width: `${store.width}px`,
                height: `${store.height + 10}px`}}
            >
                <div className="node webNode" style={{ 
                    width: '100%',
                    height: '100%'
                }}>
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <div className="nav">
                            {/* buttons to allow the forward/backward navigation */}
                            <button onClick={this.goBack}> &larr; </button>
                            <button onClick={this.goNext}> &rarr; </button>
                        </div>
                        <div className="content">
                            <h3 className="title">{store.title}</h3>
                            <iframe 
                            src={store.url} 
                            title={"Website embedded in node with link: "+store.url} 
                            allow="autoplay; encrypted-media" 
                            allowFullScreen>
                            </iframe> {/* iframe element */}
                        </div>
                    </div>
                    <ResizeBox store={store}/>
                </div>
                <button className="web-connections-button" onClick={this.toggleConnections}>+</button>
                <ConnectionWindow store={store} onCenterNode={this.props.onCenterNode}/>
            </div>
        );
    }
}