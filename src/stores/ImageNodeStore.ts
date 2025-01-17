import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

/**
 * A class that contains the data for Image Nodes
 */
export class ImageNodeStore extends NodeStore {

    /**
     * The constructor for an ImageNodeStore object
     * @param initializer -- the object to initialize as an Image Node
     */
    constructor(initializer: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public imageUrl: string | undefined;
    // stores image url

}