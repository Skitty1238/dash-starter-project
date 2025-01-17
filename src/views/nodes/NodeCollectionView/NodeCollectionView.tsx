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

/**
 * A class representing the frontend of a Collection Node
 */

@observer
export class NodeCollectionView extends React.Component<NodeCollectionProps> {

    // represent initial position of pointer
    private initialX = 0; 
    private initialY = 0;

    /**
     * Method handling mouse clicks (pointer down) on the interior of a Collection Node
     * Allows for panning (within the collection node itself)
     * @param e -- the event of a mouse click within a Collection Node
     */
    private pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        // this prevents double-panning for collections within collections (nested collections)             
       
        const elt = e.currentTarget;
        // initialize x and y positions of pointer
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

    /**
     * Renders the differrent types of nodes that may be within a collection node (i.e. its children)
     * @param nodeStore -- represents the type of node being rendered, in terms of its "store"
     * @returns -- a node of the relevant type (Text, Video, Formattable Text, Image, Web, or Collection)
     */

    private renderNode = (nodeStore: NodeStore) => {
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

    /**
     * Renders the Collection Node frontend
     * @returns -- an HTML div element representing the Collection Node 
     */

    public render() {
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
                        {store.nodes.map(this.renderNode)} {/** adds child nodes to the collection node */}
                    </div> 
                </div>
                <ResizeBox store={store}/>
            </div>
        );
    }
}