import React, { useRef } from "react";
import View from "./view";

import useDrop from "../../hooks/useDrop";

export default ({ children, heading, onDrop, onDragOver, style }) => {
  const dropRef = useRef();
  const { dropState, droppedItem } = useDrop({
    ref: dropRef,
    onDrop: onDrop,
    onDragOver: onDragOver
  });
  return (
    <View ref={dropRef} heading={heading} droppedItem={droppedItem} style={style}>
      {children}
    </View>
  );
};
