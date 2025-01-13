import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";
import { EditorState } from "draft-js";
declare module 'draft-js';

export class FormattableTextNodeStore extends NodeStore {
    
    @observable
    public text: string = "";

    constructor(initializer: Partial<FormattableTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }
}