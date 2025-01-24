import { observer } from "mobx-react";
import { action } from "mobx";
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
import { ConnectionWindow } from "../ConnectionWindow";
import { nodeService } from "../../../NodeService";


interface NodeCollectionProps {
    store: NodeCollectionStore;
    onCenterNode: (nodeId: string) => void;
}

/**
 * A class representing the frontend of a Collection Node
 */

@observer
export class NodeCollectionView extends React.Component<NodeCollectionProps> {

    private isPointerDown = false;
    // represents whether or not pointer is down on the node (for internal panning)

    private initialX = 0; 
    private initialY = 0;
    // represent initial position of pointer

    /**
     * Method handling mouse clicks (pointer down) on the interior of a Collection Node
     * Allows for panning (within the collection node itself)
     * @param e -- the event of a mouse click within a Collection Node
     */
    private pointerDown = (e: React.PointerEvent<HTMLDivElement>) => {

        if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) {
            return; // prevents panning if mouse is on the "connections" button (which also needs to be dragged)
        }

        // if (e.target != e.currentTarget) {return}
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

        /**
         * For when mouse is up (click is released)
         */

        const mouseUp = () => {
            document.removeEventListener("mousemove", pointerMove);
            document.removeEventListener("mouseup", mouseUp);
        }
        
        document.addEventListener("mousemove", pointerMove);
        document.addEventListener("mouseup", mouseUp);
        
        e.stopPropagation();
    }

    /**
     * toggles the areConnectionsVisible field of the node (used to show/hide the connections window)
     */
    @action toggleConnections = () => {
        this.props.store.areConnectionsVisible = !this.props.store.areConnectionsVisible
    }

    /**
     * Renders the differrent types of nodes that may be within a collection node (i.e. its children)
     * @param nodeStore -- represents the type of node being rendered, in terms of its "store"
     * @returns -- a node of the relevant type (Text, Video, Formattable Text, Image, Web, or Collection)
     */

    private renderNode = (nodeStore: NodeStore) => {

        switch (nodeStore.type) {
            case StoreType.Text:
                return <TextNodeView key={nodeStore.Id} store={nodeStore as StaticTextNodeStore} onCenterNode={this.props.onCenterNode}/>;
            case StoreType.Video:
                return <VideoNodeView key={nodeStore.Id} store={nodeStore as VideoNodeStore} onCenterNode={this.props.onCenterNode}/>;
            case StoreType.FormattableText:
                return <FormattableTextNodeView key={nodeStore.Id} store={nodeStore as FormattableTextNodeStore} onCenterNode={this.props.onCenterNode}/>;
            case StoreType.Image:
                return <ImageNodeView key={nodeStore.Id} store={nodeStore as ImageNodeStore} onCenterNode={this.props.onCenterNode}/>;
            case StoreType.Web:
                return <WebNodeView key={nodeStore.Id} store={nodeStore as WebNodeStore} onCenterNode={this.props.onCenterNode}/>;
            case StoreType.Collection:
                return <NodeCollectionView key={nodeStore.Id} store={nodeStore as NodeCollectionStore} onCenterNode={this.props.onCenterNode}/>;
            default:
                return null; 
        }
    }

    /**
     * Renders the Collection Node frontend
     * @returns -- an HTML div element representing the Collection Node 
     */

    public render() {
        let {store} = this.props;

        return (
            <div>
                <div className="node collectionNode" onMouseDown={this.pointerDown} // enables panning in nested collections
                style={{
                    transform: store.transform,
                    width: `${store.width}px`,
                    height: `${store.height + 10}px`
                }}>
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <div className="content">
                            <h3 className="collection-title">{store.title}</h3>
                            {store.nodes.map(this.renderNode)} {/** adds child nodes to the collection node */}
                        </div> 
                    </div>
                    <ResizeBox store={store}/>
                </div>
                <button className="collection-connections-button" onClick={this.toggleConnections} 
                style={{transform: store.transform, position: "relative", top: 0}}>+</button>

                <div style={{transform: store.transform, top: "-20px", position: "relative"}}>
                    <ConnectionWindow store={store} onCenterNode={this.props.onCenterNode}/>
                </div>
            </div>
        );
    }
}