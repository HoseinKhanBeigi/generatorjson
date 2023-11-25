import { useEffect, useState, useRef, useReducer } from "react";

import html2pdf from "html2pdf.js";

import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";
let hr = 1;

function Sechma() {

  const handleMoreThanThreeDot = (item) => {
    if (item.values) {
      const resultArray = [];
      let replacementIndex = 0;
      const dotPattern = /\.{3,}/g;
      const result = item.text.split(/(\.{3,})/);

      for (const sentence of result) {
        if (dotPattern.test(sentence)) {
          resultArray.push(item.values[replacementIndex]);
          replacementIndex++;
          const idx = resultArray.findIndex((e) => e === undefined);
          if (idx !== -1) {
            resultArray[idx] = "..........................";
          }
        } else {
          resultArray.push(sentence);
        }
      }

      return resultArray.map((el) => <>{el}</>);
    }
  };

  const contentRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const entityRef = useRef();

  const convertToPdf = async () => {
    var opt = {
      margin: 0,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 1 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // html2pdf()
    //   .set(opt)
    //   .from(contentRef.current)
    //   .save()
    //   .outputPdf()
    //   .then((pdf) => {
    //     console.log(pdf);
    //   });

    let worker = await html2pdf()
      .set(opt)
      .from(contentRef.current)
      .toPdf()
      .output("blob")
      .then((data) => {
        console.log(data);
        return data;
      })
      .save();
  };

  const [commonData, setCommonData] = useState(data1);

  const popUnshift = () => {
    const treshHold = 1050;
    let pageHeigh = 0;
    const arr = [];
    let count = 0;
    const allElementHeighs = [...contentRef.current.children[0].children]
      .map((item) => [...item.children].map((entity) => entity.clientHeight))
      .flat(Infinity);

    const allContents = data1
      .map((item) => item.pages[0].entities.map((entity) => entity))
      .flat(Infinity);

    console.log(allElementHeighs);
    console.log(allContents);

    for (let i = 0; i < allElementHeighs.length; i++) {
      pageHeigh += allElementHeighs[i];

      if (pageHeigh < treshHold) {
        arr.push(allContents[i]);
      }
    }
    console.log(arr);
  };

  return (
    <>
      <div className="btnContainer">
        <button onClick={popUnshift}>pop-unshift</button>
      </div>
      <div className="container" ref={contentRef}>
        <div className="pageA4">
          {data1.map((e, idx) =>
            e.pages?.map((page) => {
              return (
                <div
                  className="pageContent"
                  style={{ marginBottom: "5px", marginTop: "3px" }}
                >
                  {page.entities.map((item) => {
                    return (
                      <div>
                        {item.id !== "table" ? (
                          item.bold || item.contractTitle ? (
                            <div className="itemText">{item.text}</div>
                          ) : item.description ? (
                            <div className="itemDescription">{item.text}</div>
                          ) : item.title ? (
                            <div className="itemTitle">{item.text}</div>
                          ) : (
                            <div className="text">
                              {!item.regex ? (
                                <>{item.text}</>
                              ) : (
                                <>{handleMoreThanThreeDot(item)}</>
                              )}
                            </div>
                          )
                        ) : (
                          <Table tableArray={item?.table} />
                        )}
                      </div>
                    );
                  })}

                  <div className="sign">
                    <span>امضاومهر کارگزاری</span>
                    <span>امضاومهر مشتری</span>
                    <img src="public/vite.svg" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <button onClick={convertToPdf}>Convert to PDF</button>
    </>
  );
}

export default Sechma;
