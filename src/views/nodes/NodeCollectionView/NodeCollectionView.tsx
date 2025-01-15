import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore } from "../../../stores/NodeCollectionStore";
import "./NodeCollectionView.scss";
import { TopBar } from "./../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';
import { NodeStore, StoreType } from "../../../stores/NodeStore";
import { FormattableTextNodeStore } from "../../../stores/FormattableTextNodeStore";
import { FormattableTextNodeView } from "../../nodes/FormattableTextNodeView";
import { ImageNodeStore } from "../../../stores/ImageNodeStore";
import { ImageNodeView } from "../../nodes/ImageNodeView";
import { WebNodeStore } from "../../../stores/WebNodeStore";
import { WebNodeView } from "../../nodes/WebNodeView";
import { TextNodeView, VideoNodeView} from "../../nodes";
import { StaticTextNodeStore } from "../../../stores/StaticTextNodeStore";
import { VideoNodeStore } from "../../../stores/VideoNodeStore";


interface NodeCollectionProps {
    store: NodeCollectionStore;
}

@observer
export class NodeCollectionView extends React.Component<NodeCollectionProps> {

    moveNode(node: NodeStore, newParent: NodeCollectionStore) {
        node.parent?.removeNode(node);  // Remove from current parent
        newParent.addNodes([node]);     // Add to new parent
    }

    private initialX = 0; 
    private initialY = 0;

    // Panning (within the collection node itself)
    private pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        // this prevents double-panning for collections within collections (nested collections)             
       
        const elt = e.currentTarget;
        // initial x and y positions
        this.initialX = e.clientX; 
        this.initialY = e.clientY;

        // when mouse is clicked and dragged
        const pointerMove = (move : MouseEvent) => {
            let changeX = move.clientX - this.initialX;
            let changeY = move.clientY - this.initialY;

            // here, panning works by moving all objects (nodes) in that collection in 
            // the direction of the clicked mouse
            this.props.store.nodes.forEach((node : NodeStore) => {
                node.x += changeX;
                node.y += changeY;
            })

            this.initialX += changeX;
            this.initialY += changeY;

            elt.style.transform = "translate(" + this.props.store.x + "px, " + this.props.store.y + "px)";
        }

        const mouseUp = () => {
            document.removeEventListener("mousemove", pointerMove);
            document.removeEventListener("mouseup", mouseUp);
        }
        
        document.addEventListener("mousemove", pointerMove);
        document.addEventListener("mouseup", mouseUp);
        
        e.stopPropagation();
    }

    renderNode = (nodeStore: NodeStore) => {
        switch (nodeStore.type) {
            case StoreType.Text:
                return <TextNodeView key={nodeStore.Id} store={nodeStore as StaticTextNodeStore} />;
            case StoreType.Video:
                return <VideoNodeView key={nodeStore.Id} store={nodeStore as VideoNodeStore} />;
            case StoreType.FormattableText:
                return <FormattableTextNodeView key={nodeStore.Id} store={nodeStore as FormattableTextNodeStore} />;
            case StoreType.Image:
                return <ImageNodeView key={nodeStore.Id} store={nodeStore as ImageNodeStore} />;
            case StoreType.Web:
                return <WebNodeView key={nodeStore.Id} store={nodeStore as WebNodeStore} />;
            case StoreType.Collection:
                return <NodeCollectionView key={nodeStore.Id} store={nodeStore as NodeCollectionStore} />;
            default:
                return null; 
        }
    }


    render() {
        let store = this.props.store;

        return (
            <div className="node collectionNode" onMouseDown={this.pointerDown} // enables panning in nested collections
             style={{
                    transform: store.transform,
                    width: `${store.width}px`,
                    height: `${store.height}px`}}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <div className="content">
                        <h3 className="collection-title">{store.title}</h3>
                        {store.nodes.map(this.renderNode)}
                    </div>
                </div>
                <ResizeBox store={store}/>
            </div>
        );
    }
}