import React from 'react';
import { observer } from "mobx-react";
import { action, observable } from 'mobx';
import { NodeCollectionStore, StoreType, StaticTextNodeStore, VideoNodeStore } from './stores';
import { ImageNodeStore } from './stores/ImageNodeStore';
import { WebNodeStore } from './stores/WebNodeStore';
import { FormattableTextNodeStore } from './stores/FormattableTextNodeStore';
import "./NodeModal.scss";

interface NodeModalProps {
    store: NodeCollectionStore;
}

/**
 * Class representing the modal element (form) to add nodes to the main collection (i.e. the main canvas)
 */

@observer
class NodeModal extends React.Component<NodeModalProps> {
    @observable private type = StoreType.Text;
    @observable private title = '';
    @observable private text = '';
    @observable private url = '';

    /**
     * Constructor for the modal element
     * @param props -- the props passed down to the modal element
     */
    public constructor(props: NodeModalProps) {
        super(props);
    }

    /**
     * Method to handle closing the modal element
     */

    @action close = () => {
        this.props.store.isModalOpen = false;
    }

    /**
     * Method to handle changing the node type field in the modal element 
     * @param newType -- the string representing the new node type selected 
     * (represented as a number corresponding to the types listed in NodeStore, in order
     * i.e. "1" for Text, "2" for Video, etc.)
     */

    @action changeType = (newType: string) => {
        const typeArray = [StoreType.Text, StoreType.Video, StoreType.FormattableText,
            StoreType.Image, StoreType.Web, StoreType.Collection]
        this.type = typeArray[Number(newType)];
    }

    /**
     * Method handling a change in the title input field of the form
     * @param newTitle -- the input title
     */

    @action changeTitle = (newTitle: string) => {
        this.title = newTitle;
    }

    /**
     * Method handling a change in the text input field of the form
     * @param newText -- the input text
     */

    @action chanegText = (newText: string) => {
        this.text = newText;
    }

    /**
     * Method handling a change in the URL input field of the form
     * @param newURL -- the input URL
     */

    @action changeURL = (newURL: string) => {
        this.url = newURL;
    }

    /**
     * Method handling event where "Create Node" button is clicked (form is submitted)
     * The node created is based on the node type selected, and its fields are populated 
     * based on the answers given in the input fields
     * @param e -- event where form is submitted
     */

    @action submit = (e: React.FormEvent) => {
        e.preventDefault();

        // type of node created is based on current type selected in the form
        switch (this.type) {
            case StoreType.Text:
                this.props.store.addNodes([new StaticTextNodeStore({ type: this.type, title: this.title, text: this.text })]);
                break;
            case StoreType.Video:
                this.props.store.addNodes([new VideoNodeStore({ type: this.type, title: this.title, url: this.url })]);
                break;
            case StoreType.Image:
                this.props.store.addNodes([new ImageNodeStore({ type: this.type, title: this.title, imageUrl: this.url })]);
                break;
            case StoreType.Web:
                this.props.store.addNodes([new WebNodeStore({ type: this.type, title: this.title, url: this.url })]);
                break;
            case StoreType.FormattableText:
                this.props.store.addNodes([new FormattableTextNodeStore({ type: this.type, title: this.title })]);
                break;
            case StoreType.Collection:
                this.props.store.addNodes([new NodeCollectionStore({ type: this.type, title: this.title })])
        }
        this.close(); // closes the form once it is submiited
    };

    /**
     * Renders the form element
     * @returns -- nothing if the form is not set to be visible, otherwise an HTML
     * div element representing the form
     */

    public render() {
        if (!this.props.store.isModalOpen) return null;

        return (
            <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={this.close}>&times;</button> {/** Closes the form */}
                    <form onSubmit={this.submit}>
                        <label> {/* Dropdown menu to select type of node to be added */}
                            Node Type:
                            <select value={this.type} 
                            onChange={e => this.changeType(e.target.value)}> {/** Updates the type based on the target value selected */}
                                <option value={StoreType.Text}>Text</option>
                                <option value={StoreType.Video}>Video</option>
                                <option value={StoreType.Image}>Image</option>
                                <option value={StoreType.Web}>Web</option>
                                <option value={StoreType.FormattableText}>Formattable Text</option>
                                <option value={StoreType.Collection}>Collection</option>
                            </select>
                        </label>

                        <label> {/* Title field -- appears for any node type selected (since all nodes can have titles) */}
                            Title:
                            <input type="text" value={this.title} onChange={e => this.changeTitle(e.target.value)} />
                        </label>
                        
                        {(this.type === StoreType.Text) && ( /** Text field -- only appears if (Static) Text node type is selected */
                            <label>
                                Text:
                                <textarea value={this.text} onChange={e => this.chanegText(e.target.value)} />
                            </label>
                        )}
                        {(this.type === StoreType.Video || this.type === StoreType.Web || this.type === StoreType.Image) && (
                            /**
                             * URL field -- only appears if any of Video, Web, or Image node types are selected
                             */
                            <label>
                                URL:
                                <input type="text" value={this.url} onChange={e => this.changeURL(e.target.value)} />
                            </label>
                        )}
                        <button type="submit">Create Node</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default NodeModal;
