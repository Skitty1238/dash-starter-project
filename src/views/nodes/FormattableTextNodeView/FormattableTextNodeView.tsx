import React from 'react';

// imports quill text editor functionality
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { observer } from "mobx-react";
import { FormattableTextNodeStore } from "../../../stores/FormattableTextNodeStore";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox'; // for resizing node functionality
import "./FormattableTextNodeView.scss";
import { ConnectionWindow } from '../ConnectionWindow';
import { action } from 'mobx';

interface FormattableTextNodeProps {
    store: FormattableTextNodeStore;
    onCenterNode: (nodeId: string) => void; // method to center the node on the screen
}

/**
 * A class representing the Formattable Text Node frontend
 */

@observer
export class FormattableTextNodeView extends React.Component<FormattableTextNodeProps> {

    // reference to the quill text-editor object 
    private quillRef: React.RefObject<ReactQuill>;

    /**
     * Constructor for a Formattable Text Node 
     * @param props -- the props passed down to the node
     */
    constructor(props: FormattableTextNodeProps) {
        super(props);
        this.quillRef = React.createRef<ReactQuill>();
    }
    
    /**
     * Updates text stored in the node given new text input
     * @param text -- the input text
     */
    private newText = (text: string) => {
        this.props.store.text = text;
    };

    // 
    /**
     * Puts focus on the quill editor (i.e. cursor will become active)
     */
    private focusEditor = () => {
        if (this.quillRef.current && !this.quillRef.current.getEditor().hasFocus()) {
            this.quillRef.current.getEditor().focus();
        }
    }

    /**
     * toggles the areConnectionsVisible field of the node (used to show/hide the connections window)
     */
    @action toggleConnections = () => {
        this.props.store.areConnectionsVisible = !this.props.store.areConnectionsVisible
    }

    /**
     * Renders the Formattable Text Node. Uses React-Quill
     * @returns -- an HTML div element representing the Formattable Text Node
     */
    public render() {
        let { store } = this.props;

        // customize functionality of the text editor
        // the "header" functionality is intended to be equivalent to a title
        // clear just clears any text formatting
        const modules = {
            toolbar: [
                [{ 'header': '1' }, 'bold', 'italic'],
                ['underline', 'strike', 'clean'],
                ['image', {'list': 'ordered'}, {'list': 'bullet'}],
            ]
        };

        // controls type of content that can be added
        const formats = [
            'header', 'bold', 'italic', 
            'underline', 'strike','clean',
            'image', 'list', 'bullet',
        ];


        return (
            <div className="node-container" style={{
                transform: store.transform,
                position: 'absolute',
                width: `${store.width}px`,
                height: `${store.height + 10}px`}}> {/** adjusted height to accommodate connection window */} 

                <div className="node formattableTextNode" style={{ 
                    width: '100%',
                    height: '100%'
                }} onClick={this.focusEditor}> {/* puts the respective quill text editor into "focus" when the corresponding node is clicked*/}
                    <TopBar store={store}/>
                    <div className="scroll-box">
                        <ReactQuill
                            ref={this.quillRef} // stores reference to current editor
                            value={store.text} // stores the text 
                            onChange={this.newText} // updates the text upon changes
                            modules={modules}
                            formats={formats}
                        />
                    </div>
                    <ResizeBox store={store}/> {/* box for resizing functionality (click and drag to resize) */}
                </div>
                <button className="formattable-connections-button" onClick={this.toggleConnections}>+</button>
                <ConnectionWindow store={store} onCenterNode={this.props.onCenterNode}/>
            </div>
        );
    }
}