# Instructions on how to use the app:

When you open the application, you will see a blank canvas, an empty sidebar (on the left hand side), an empty favorites bar (at the top right corner), and a add node button (+) on the bottom right.


Creating nodes:

If you click the (+) button, a form will open allowing you to create nodes of your liking -- you can select the node type from the dropdown menu, and fill in any relevant fields. Once you click submit, a node will be created. 


Deleting nodes:

All nodes can be deleted using the "x" button at the top right of the node. This will delete the node and any child nodes it may have (if it is a collection).


Resizing nodes:

All nodes can be resized by dragging the resize box at the bottom right of the node.


Sidebar (collection functionality):

As you create nodes, you will see the sidebar becoming populated with the node titles.
To move nodes into collections, you must use the sidebar -- clicking on a node title in the sidebar and dragging it to the title of a collection node in the sidebar will move that node into that collection. Both the sidebar and freeform canvas will update accordingly to reflect this change. The same method can be used to nest collections (i.e. drag collection nodes into other collection nodes). To remove a node from a collection, you can drag that node's title in the sidebar out of the collection node and onto the sidebar itself (to return it to the main canvas) or a different node collection title to move the node into that collection.

The sidebar can be resized horizontally using the resize handle at the bottom right of the sidebar


Panning inside collections:

As with the freeform canvas, you can pan inside collection nodes to move the interior canvas of the collection node


Connecting nodes:

All nodes have a connection window that can be opened (and closed) via the (+) button on the top left of the node. This window displays all the nodes that the current node is bi-directionally "linked" to. Each node's window has a button called "Drag to connect".

If you click and drag this button to the connection window of another node, the two nodes will be "connected", and a button will appear in both the node's connection windows with the title of the other node. If this button is clicked, the freeform canvas will pan to take you to the connected node. Next to this button is an "x" button that deletes the bi-directional connection. 

Each node can be connected to multiple other nodes (but not itself). (Physical lines are not shown for connections to reduce on-screen clutter)


Starring/Favoriting nodes:
Important nodes that the user may need to navigate to often can be starred. Each node has a star button at the top left, which can be toggled on and off. When it is toggled on, a corresponding star appears on the favorites bar at the top right of the window. 

The favorites bar will house corresponding stars (which act as buttons) for each starred node. Hovering over a star in the favorites bar will tell you which node it refers to (title and node type). Clicking on a star in the favorites bar will move (pan) the canvas to navigate you to the corresponding starred node. 

This may be a useful feature to quickly navigate to especially important nodes (like starred emails).


# Starter Project

Welcome to the Dash Starter Project!

From the project directory, run
* `npm install` (you only need to do this if you are running it for the first time!)
* `npm start`
* `go to http://localhost:3000` in Chrome or Firefox

If you have issues (or if you're running it for the first time), run `npm install` in the project directory and repeat the above steps.