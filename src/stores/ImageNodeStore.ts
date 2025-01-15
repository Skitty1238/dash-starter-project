import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

// store for image nodes
export class ImageNodeStore extends NodeStore {

    constructor(initializer: Partial<ImageNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public imageUrl: string | undefined;
    // stores image url

}