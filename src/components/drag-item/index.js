import React, { useState, useRef } from "react";
import "../../index.css";
import useDrag from "../../hooks/useDrag";
import View from "./view";

export default ({ dragEffect, data, key, id, onDragStart, onDragOver }) => {
  const dragRef = useRef();
  const [classValue, setClassValue] = useState("grab");
  const { dragState } = useDrag({
    id,
    effect: dragEffect,
    ref: dragRef,
    onDragStart: () => {
      onDragStart(id);
      setClassValue("grabbing");
    },
    onDragOver: () => onDragOver(id),
    onDragEnd: () => {
      setClassValue("grab");
    }
  });
  return <View ref={dragRef} key={key} data={data} classValue={classValue} />;
};
