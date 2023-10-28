import React from "react";

const Table = ({ tableArray }) => {
  return (
    <div className="table">
      {tableArray?.map((row, index) => (
        <div key={row} className="row">
          {row.map((col) => (
            <div key={col} className="cell">
              {
                <span key={col}>
                  {col.text} &nbsp;{" "}
                  {Array.isArray(col?.itemValue)
                    ? !col.div
                      ? col?.value?.map((e) => (
                          <span style={{ paddingLeft: "16px" }}>{e}</span>
                        ))
                      : col?.itemValue?.map((e) => (
                          <div style={{ paddingLeft: "16px" }}>{e}</div>
                        ))
                    : col?.itemValue}
                </span>
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
