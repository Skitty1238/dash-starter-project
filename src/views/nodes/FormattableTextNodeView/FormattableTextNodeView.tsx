import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { observer } from "mobx-react";
import { FormattableTextNodeStore } from "../../../stores/FormattableTextNodeStore";
import { TopBar } from "../TopBar";
import { ResizeBox } from '../ResizeBox/ResizeBox';

interface FormattableTextNodeProps {
    store: FormattableTextNodeStore;
}

@observer
export class FormattableTextNodeView extends React.Component<FormattableTextNodeProps> {
    private quillRef: React.RefObject<ReactQuill>;

    constructor(props: FormattableTextNodeProps) {
        super(props);
        this.quillRef = React.createRef<ReactQuill>();
    }
    
    handleNewText = (text: string) => {
        this.props.store.text = text;
    };

    focusEditor = () => {
        if (this.quillRef.current && !this.quillRef.current.getEditor().hasFocus()) {
            this.quillRef.current.getEditor().focus();
        }
    }

    render() {
        let { store } = this.props;

        const modules = {
            toolbar: [
                [{ 'header': '1' }, 'bold', 'italic'],
                ['underline', 'strike', 'clean'],
                ['image', {'list': 'ordered'}, {'list': 'bullet'}],
            ]
        };

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
            }} onClick={this.focusEditor}>
                <TopBar store={store}/>
                <div className="scroll-box">
                    <ReactQuill
                        ref={this.quillRef}
                        value={store.text}
                        onChange={this.handleNewText}
                        modules={modules}
                        formats={formats}
                    />
                </div>
                <ResizeBox store={store}/>
            </div>
        );
    }
}