import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

/**
 * A class that contains the data for Formattable Text Nodes -- i.e. nodes that 
 * are not static (are formattable)
 * Extends NodeStore to retain common properties (fields) between all node types
 */
export class FormattableTextNodeStore extends NodeStore {
    
    @observable
    public text: string = "";

    /**
     * A constructor for FormattableTextNodeStore
     * @param initializer -- object to initialize into a FormattableTextNodeStore object
     */
    constructor(initializer: Partial<FormattableTextNodeStore>) {
        super();
        Object.assign(this, initializer);
    }
}