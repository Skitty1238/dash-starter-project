import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

/**
 * A class that contains the data of a Website Node
 */
export class WebNodeStore extends NodeStore {

    /**
     * Constructor for WebNodeStore
     * @param initializer -- object to initialize as a Web Node
     */
    constructor(initializer: Partial<WebNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public url: string = "";
    // stores the website url

}