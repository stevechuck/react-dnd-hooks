import React, { useState, useRef, useMemo } from "react";
import "../../index.css";
import useDrag from "../../hooks/useDrag";
import View from "./view";

export default ({ dragEffect, data, id, onDragStart, onDragOver }) => {
  const dragRef = useRef();
  const [classValue, setClassValue] = useState("grab");
  const { dragState } = useDrag({
    id,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: (ev) => {
      onDragStart(id);
      window.requestAnimationFrame(() => { ev.target.style.visibility = "hidden"; });
    },
    onDragOver: () => onDragOver(id),
    onDragEnd: (ev) => {
      window.requestAnimationFrame(() => { ev.target.style.visibility = "visible"; });
    }
  });

  const styles = useMemo(() => ({
    cursor: dragState == "dragging" ? '-webkit-grabbing' : '-webkit-grab',
    zIndex: dragState == "dragging" ? 2 : 1,
    transition: "transform 1s"
  }), [dragState]);

  return <View ref={dragRef} data={data} styles={styles} classValue={classValue} />;
};
