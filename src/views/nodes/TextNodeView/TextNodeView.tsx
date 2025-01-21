import { observer } from "mobx-react";
import * as React from 'react';

import { NodeCollectionStore, StaticTextNodeStore } from "../../../stores";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import "./../NodeView.scss";
import "./TextNodeView.scss";
import { ConnectionWindow } from "../ConnectionWindow";


interface TextNodeProps {
    store: StaticTextNodeStore;
    mainStore: NodeCollectionStore;
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
        let {store, mainStore} = this.props;

        return (
            <div className="node-container" style={{
                transform: store.transform,
                position: 'absolute',
                width: `${store.width}px`,
                height: `${store.height + 10}px`}}>
                    <div className="node textNode" style={{ 
                        width: '100%',
                        height: '100%'
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
                    <ConnectionWindow store={store} mainStore={mainStore}/>
            </div>
        );
    }
}