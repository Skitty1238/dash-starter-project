import { observable } from "mobx";
import { NodeStore } from "./NodeStore";


/**
 * A class that contains the data of a Video Node
 */

export class VideoNodeStore extends NodeStore {

    /**
     * A constructor for VideoNodeStore
     * @param initializer -- the object to initialize as a Video Node
     */

    constructor(initializer: Partial<VideoNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public url: string | undefined;
    // the video URL

}