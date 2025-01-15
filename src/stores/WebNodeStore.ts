import { action, observable } from "mobx";
import { NodeStore } from "./NodeStore";

// store for the Web Nodes
export class WebNodeStore extends NodeStore {

    constructor(initializer: Partial<WebNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public url: string = "";
    // stores the website url

}