import React from 'react';
import './App.scss';
import { NodeCollectionStore, NodeStore, StaticTextNodeStore, StoreType, VideoNodeStore } from './stores';
import { FormattableTextNodeStore } from "./stores/FormattableTextNodeStore";
import { ImageNodeStore } from "./stores/ImageNodeStore";
import { WebNodeStore } from "./stores/WebNodeStore";
import { FreeFormCanvas } from './views/freeformcanvas/FreeFormCanvas';
import 'react-quill/dist/quill.snow.css';
import { Sidebar } from "./Sidebar";


const mainNodeCollection = new NodeCollectionStore();

// create a bunch of text and video nodes (you probably want to delete this at some point)
let numNodes: number = 300;
let maxX: number = 10000;
let maxY: number = 10000;
let nodes: NodeStore[] = [];

// add 100 static text nodes to random locations
for (let i = 0; i < numNodes / 3; i++) {
    nodes.push(new StaticTextNodeStore({ type: StoreType.Text, x: Math.random() * maxX, y: Math.random() * maxY, title: "Text Node Title", text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?" }));
}

// add 100 video nodes to random locations
for (let i = 0; i < numNodes / 3; i++) {
    nodes.push(new VideoNodeStore({ type: StoreType.Video, x: Math.random() * maxX, y: Math.random() * maxY, title: "Video Node Title", url: "http://cs.brown.edu/people/peichman/downloads/cted.mp4" }));
}

// add 100 formattable text nodes
for (let i = 0; i < numNodes / 3; i++) {
    nodes.push(new FormattableTextNodeStore({ type: StoreType.FormattableText, x: Math.random() * maxX, y: Math.random() * maxY, text: "<h1>Formattable Title</h1><p>Sample Text. Click the node and use the toolbar + your arrow keys to edit me!</p>" }));
}

// add 100 image nodes
for (let i = 0; i < 100; i++) {
    nodes.push(new ImageNodeStore({ type: StoreType.Image, x: Math.random() * maxX, y: Math.random() * maxY, title: "Image Node Title", imageUrl: "https://is3-ssl.mzstatic.com/image/thumb/Music115/v4/15/38/9b/15389bf4-8074-06c3-11ee-655b5453af68/21UM1IM25046.rgb.jpg/256x256bb.jpg"}));
}

// add 10 web nodes
for (let i = 0; i < 10; i++) {
    nodes.push(new WebNodeStore({ type: StoreType.Web, x: Math.random() * maxX, y: Math.random() * maxY, title: "Web Node Title", url: "https://512kb.club/"}));
}

// add set of nodes to node collection
mainNodeCollection.addNodes(nodes);

// node collection:

// Create a collection node
const collectionNode = new NodeCollectionStore();
collectionNode.type = StoreType.Collection
collectionNode.x = 500; // Set initial position
collectionNode.y = 500;
collectionNode.width = 800;
collectionNode.height = 800;
collectionNode.title = "Collection";

const nestedCollectionNode = new NodeCollectionStore();
nestedCollectionNode.type = StoreType.Collection;
nestedCollectionNode.x = 200;
nestedCollectionNode.y = 200;
nestedCollectionNode.title = "Nested Collection";
nestedCollectionNode.addNodes([new StaticTextNodeStore({ type: StoreType.Text, title:"Nested Title", text:"nested text"})])

// Add various nodes to this collection node
collectionNode.addNodes([
    new StaticTextNodeStore({ type: StoreType.Text, x: 20, y: 20, title: "Inner Text Node", text: "Inner text node within a collection." }),
    new VideoNodeStore({ type: StoreType.Video, x: 100, y: 50, title: "Inner Video Node", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }),
    nestedCollectionNode
]);

// Add the collection node to the main node collection
mainNodeCollection.addNodes([collectionNode]);

export class App extends React.Component {

    // function handling moving nodes to/from/between collections (in the sidebar)
    onMoveNode = (nodeId: string, newParentId?: string) => {

        // find current node and its parent
        const nodeToMove = mainNodeCollection.findNodeById(nodeId);
        const newParentNode = newParentId ? mainNodeCollection.findNodeById(newParentId) as NodeCollectionStore : mainNodeCollection;

        if (nodeId === newParentId) {
            return; // prevent moving the node to itself (was exhibiting weird behaviour)
        }
    
        if (nodeToMove && newParentNode && nodeToMove.parent !== newParentNode) { 

            // remove node from its current parent collection 
            // (unless its parent is the main collection, in which case
            // nodeToMove.parent is null)
            if (nodeToMove.parent) {
                nodeToMove.parent.removeNode(nodeToMove);
            }

            // add the node to the new parent collection
            newParentNode.addNodes([nodeToMove]);
            nodeToMove.parent = newParentNode;

            // move the node to the center of the collection node it has been added to, 
            // so that it is instantly visible 
            if (newParentNode !== mainNodeCollection) {
                nodeToMove.x = (newParentNode.width / 2) - (nodeToMove.width / 2);
                nodeToMove.y = (newParentNode.height / 2) - (nodeToMove.height / 2);
            }
            
        } else if (nodeToMove && !newParentNode && nodeToMove.parent !== newParentNode) { 
            // handles moving node into the main collection
            if (nodeToMove.parent) {
                nodeToMove.parent.removeNode(nodeToMove);
            }

            mainNodeCollection.addNodes([nodeToMove]);
        }
    }

    render() {
        return (
            <div className="App">
            <FreeFormCanvas store={mainNodeCollection}/> 
            <Sidebar store={mainNodeCollection} onMoveNode={this.onMoveNode}/>
            </div>
        );
    }
}

export default App;