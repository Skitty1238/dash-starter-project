import { observer } from "mobx-react";
import * as React from 'react';
import { NodeStore, StoreType } from "../../../stores";
import "./TopBar.scss";

interface TopBarProps {
    store: NodeStore;
}

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
        return '#ccc';
    }
  };

@observer
export class TopBar extends React.Component<TopBarProps> {

    private isPointerDown = false;

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        this.props.store.x += e.movementX;
        this.props.store.y += e.movementY;
    }

    render() {
        const { store } = this.props;
        const backgroundColor = getColorForNodeType(store.type);
        return <div className="topbar" 
        style={{ backgroundColor }}
        onPointerDown={this.onPointerDown} />
    }
}
