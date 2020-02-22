import React, { forwardRef } from "react";
import "./styles.css";

export default forwardRef(({ data, styles, classValue }, ref) => {
  return (
    <div className={`item ${classValue}`} style={styles} ref={ref}>
      {data.text}
    </div>
  );
});
