import React from 'react';
import { observer } from "mobx-react";
import { WebNodeStore } from "../../../stores/WebNodeStore";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./WebNodeView.scss";


interface WebNodeProps {
    store: WebNodeStore;
}

@observer
export class WebNodeView extends React.Component<WebNodeProps> {

    // the iframe element that is embedded (stored) in the node
    private iframeRef: React.RefObject<HTMLIFrameElement> = React.createRef();

    // function that updates the current iframe element of the node 
    // to the previous element, if there is one
    goBack = () => {
        if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
            this.iframeRef.current.contentWindow.history.back();
        }
    }

    // function that updates the current iframe element of the node 
    // to the next element, if there is one
    goNext = () => {
        if (this.iframeRef.current && this.iframeRef.current.contentWindow) {
            this.iframeRef.current.contentWindow.history.forward();
        }
    }

    render() {
        let { store } = this.props;

        return (
            <div className="node webNode" style={{ 
                transform: store.transform,
                width: `${store.width}px`,
                height: `${store.height}px`
            }}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <div className="nav">
                        {/* buttons to activate the forward/backward navigation */}
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
        );
    }
}