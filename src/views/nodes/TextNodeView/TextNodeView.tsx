import { observer } from "mobx-react";
import * as React from 'react';

import { StaticTextNodeStore } from "../../../stores";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./../NodeView.scss";
import "./TextNodeView.scss";


interface TextNodeProps {
    store: StaticTextNodeStore;
}

/**
 * A class representing the (Static) Text Node frontend
 */

@observer
export class TextNodeView extends React.Component<TextNodeProps> {

    /**
     * Renders the frontend of the Text Node
     * @returns -- HTML div elemetn representing the Static Text Node
     */

    public render() {
        let store = this.props.store;

        return (
                <div className="node textNode" style={{ 
                    transform: store.transform,
                    width: `${store.width}px`,
                    height: `${store.height}px`
                }} onWheel={(e: React.WheelEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}>
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <div className="content">
                            <h3 className="title">{store.title}</h3>
                            <p className="paragraph">{store.text}</p>
                        </div>
                    </div>
                    <ResizeBox store={store}/>
                    
                </div>
        );
    }
}