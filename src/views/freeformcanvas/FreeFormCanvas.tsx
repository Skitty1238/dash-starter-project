import { observer } from "mobx-react";
import * as React from 'react';
import { NodeCollectionStore, StaticTextNodeStore, StoreType, VideoNodeStore } from "../../stores";
import { FormattableTextNodeStore } from "../../stores/FormattableTextNodeStore";
import { FormattableTextNodeView } from "../nodes/FormattableTextNodeView";
import { ImageNodeStore } from "../../stores/ImageNodeStore";
import { ImageNodeView } from "../nodes/ImageNodeView";
import { WebNodeStore } from "../../stores/WebNodeStore";
import { WebNodeView } from "../nodes/WebNodeView";
import { NodeCollectionView } from "../nodes/NodeCollectionView";
import { TextNodeView, VideoNodeView} from "../nodes";
import "./FreeFormCanvas.scss";
import { action } from "mobx";
import { nodeService } from "../../NodeService";

interface FreeFormProps {
    store: NodeCollectionStore // mainCollectionStore
}

/**
 * A class representing the freeform canvas (main canvas on which nodes are added)
 */
@observer
export class FreeFormCanvas extends React.Component<FreeFormProps> {
    private isPointerDown: boolean | undefined;

    /**
     * Handles pointer down events on the main freeform canvas 
     * @param e -- the pointer event triggered when mouse is pressed down on the canvas
     */

    private onPointerDown = (e: React.PointerEvent): void => {
        if (e.target === e.currentTarget) {
            e.stopPropagation();
            e.preventDefault();
            this.isPointerDown = true;
            document.removeEventListener("pointermove", this.onPointerMove);
            document.addEventListener("pointermove", this.onPointerMove);
            document.removeEventListener("pointerup", this.onPointerUp);
            document.addEventListener("pointerup", this.onPointerUp);
        }
    }

    /**
     * Handles pointer up events on the main freeform canvas 
     * @param e -- the pointer event triggered when mouse click is released
     */

    private onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    /**
     * Handles pointer movement events on the main freeform canvas, 
     * allowing dragging the canvas (panning ability)
     * @param e -- the pointer event triggered when the clicked mouse is moved
     * @returns -- returns if pointer is not down
     */

    private onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        this.props.store.x += e.movementX;
        this.props.store.y += e.movementY;
    }

    @action onCenterNode = (nodeId: string) => {
        const node = nodeService.findNodeById(nodeId);
        let x = 0;
        let y = 0;
 
        if (node) {
            const nodeParent = nodeService.getTopMostParent(node);
            if (nodeParent) { 
                x = nodeParent.x
                y = nodeParent.y
                nodeParent.centerOnNode(nodeId)
            } else {
                x = node.x;
                y = node.y
            }

            // Center the canvas around the node
            this.props.store.x = window.innerWidth / 2 - node.width / 2 - x;
            this.props.store.y = window.innerHeight / 2 - node.height / 2 - y;
        }
    }


    /**
     * Renders the canvas and all the nodes that populate it (i.e. its "children")
     * @returns a freeform canvas HTML div element 
     */

    public render() {
        const store = this.props.store;

        return (
            <div className="freeformcanvas-container" onPointerDown={this.onPointerDown}
>
                <div className="freeformcanvas" style={{ transform: store.transform }}>
                    {   
                        // maps each item in the store to be rendered in the canvas based on the node type
                        store.nodes.map(nodeStore => {
                            switch (nodeStore.type) {
                                case StoreType.Text:
                                    return (<TextNodeView key={nodeStore.Id} store={nodeStore as StaticTextNodeStore} onCenterNode={this.onCenterNode}/>)

                                case StoreType.Video:
                                    return (<VideoNodeView key={nodeStore.Id} store={nodeStore as VideoNodeStore} onCenterNode={this.onCenterNode}/>)

                                // same format followed below for each new node type created (Formattable Text, Image, Web)

                                case StoreType.FormattableText:
                                    return (<FormattableTextNodeView key={nodeStore.Id} store={nodeStore as FormattableTextNodeStore} onCenterNode={this.onCenterNode}/>);

                                case StoreType.Image:
                                    return (<ImageNodeView key={nodeStore.Id} store={nodeStore as ImageNodeStore} onCenterNode={this.onCenterNode}/>)

                                case StoreType.Web:
                                    return (<WebNodeView key={nodeStore.Id} store={nodeStore as WebNodeStore} onCenterNode={this.onCenterNode}/>)
                                
                                case StoreType.Collection:
                                    return (<NodeCollectionView key={nodeStore.Id} store={nodeStore as NodeCollectionStore} onCenterNode={this.onCenterNode}/>)

                                default:
                                    return (null);
                            }
                        })
                    }
                </div>
            </div>
        );
    }
}
