import React from 'react';

// imports quill text editor functionality
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { observer } from "mobx-react";
import { FormattableTextNodeStore } from "../../../stores/FormattableTextNodeStore";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox'; // for resizing node functionality
import "./FormattableTextNodeView.scss";


interface FormattableTextNodeProps {
    store: FormattableTextNodeStore;
}

@observer
export class FormattableTextNodeView extends React.Component<FormattableTextNodeProps> {

    // reference to the quill text-editor object 
    private quillRef: React.RefObject<ReactQuill>;

    constructor(props: FormattableTextNodeProps) {
        super(props);
        this.quillRef = React.createRef<ReactQuill>();
    }
    
    // updates text stored in the node given new text input
    handleNewText = (text: string) => {
        this.props.store.text = text;
    };

    // puts focus on the quill editor (i.e. cursor will become active)
    focusEditor = () => {
        if (this.quillRef.current && !this.quillRef.current.getEditor().hasFocus()) {
            this.quillRef.current.getEditor().focus();
        }
    }

    render() {
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
            <div className="node formattableTextNode" style={{ 
                transform: store.transform,
                width: `${store.width}px`,
                height: `${store.height}px`
            }} onClick={this.focusEditor}> {/* puts the respective quill text editor into focus when the corresponding node is clicked*/}
                <TopBar store={store}/>
                <div className="scroll-box">
                    <ReactQuill
                        ref={this.quillRef} // stores reference to current editor
                        value={store.text} // stores the text 
                        onChange={this.handleNewText} // updates the text upon changes
                        modules={modules}
                        formats={formats}
                    />
                </div>
                <ResizeBox store={store}/> {/* box for resizing functionality (click and drag to resize) */}
            </div>
        );
    }
}