import { observer } from "mobx-react";
import * as React from 'react';
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import "./../NodeView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./ImageNodeView.scss";

interface ImageNodeProps {
    store: ImageNodeStore;
}

/**
 * A class representing the Image Node frontend
 */

@observer
export class ImageNodeView extends React.Component<ImageNodeProps> {
    /**
     * Renders the Image Node
     * @returns -- an HTML div element representing an Image Node
     */
    public render() {
        let store = this.props.store;

        return (
            <div className="node imageNode" style={{
                    transform: store.transform,
                    width: `${store.width}px`,
                    height: `${store.height}px`}}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="title">{store.title}</h3>
                        <img src={store.imageUrl} alt={store.title}/> {/** stores image url */}
                    </div>
                </div>
                <ResizeBox store={store}/>
            </div>
        );
    }
}