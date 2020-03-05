import React, { forwardRef } from "react";
import "./styles.css";

export default forwardRef(({ children, heading, style }, ref) => {
  return (
    <div className="container" ref={ref} style={style}>
      <h3>{heading}</h3>
      <div className="body">{children}</div>
    </div>
  );
});
