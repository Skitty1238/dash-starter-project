import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore, StoreType } from "../../../stores";
import { DeleteButton } from '../DeleteButton';
import "./TopBar.scss";
import { action } from "mobx";

interface TopBarProps {
    store: NodeStore;
}

/**
 * Method that determines color of top bar based on the type of node it is being added to
 * @param type -- type of the node being rendered
 * @returns -- a string representing a color for the given node
 */
const getColorForNodeType = (type: StoreType | null | undefined) => {
    switch (type) {
      case StoreType.Text:
        return "#aa6da3"; 
      case StoreType.Video:
        return "#7c709e"; 
      case StoreType.Image:
        return "#4d7298";
      case StoreType.Web:
        return "#be8a66"; 
      case StoreType.FormattableText:
        return "#aa6f77";
      case StoreType.Collection:
        return "#171614"; 
      default:
        return "#ffffff";
    }
  };

/**
 * Class representing the top bar on each node -- used to move the 
 * node around the main canvas / a collection it is inside
 */

@observer
export class TopBar extends React.Component<TopBarProps> {

    private isPointerDown = false;

    /**
     * Method handling event where mouse is clicked on top bar (already implemented)
     * @param e -- event of mouse click on top bar
     */
    private onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    /**
     * Method handling event where mouse click on top bar ends (already implemented)
     * @param e -- event where mouse click ends
     */
    private onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    /**
     * Method handling event where mouse is clicked on top bar and dragged (already implemented)
     * @param e - event of mouse click and drag
     * @returns -- if mouse click ends
     */
    private onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        this.props.store.x += e.movementX;
        this.props.store.y += e.movementY;
    }

    /**
     * Renders the top bar frontend
     * @returns -- HTML div element representing the top bar
     */
    public render() {
        const { store } = this.props;
        const backgroundColor = getColorForNodeType(store.type);
        return <div className="topbar" 
        style={{ backgroundColor }}
        onPointerDown={this.onPointerDown}>
          <DeleteButton store={store} />
          <button id="fav-button" onClick={store.toggleStar} > {/** button to "favorite" a node -- i.e. save it in favorites bar */}
          {store.isStarred ? "★" : "☆"}
          </button>
        </div>
        
    }
}
