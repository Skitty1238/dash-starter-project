import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

// Store for text nodes that are not static (are formattable)
export class FormattableTextNodeStore extends NodeStore {
    
    @observable
    public text: string = "";

    constructor(initializer: Partial<FormattableTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }
}