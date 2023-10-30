import { useEffect, useState, useRef, useReducer } from "react";

import html2pdf from "html2pdf.js";

import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";

function Sechma() {
  const pageRef = useRef();
  const htmlElementRef = useRef(null);
  const [url, setUrl] = useState("");
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

  const convertToPdf = () => {
    const test11 = [
      [21, 42, 21, 21, 284, 42, 21, 365, 340, 120],
      [0, 21, 458, 21, 200, 300],
      [0, 21, 932],
      [0, 21, 407],
      [21, 42, 42, 42, 63, 20, 21, 42, 21, 0, 20, 0, 21, 21, 21, 20, 21],
    ];

    const threshold = 953;
    const test11Transformed = [];

    for (let i = 0; i < test11.length; i++) {
      const subarray = test11[i];
      let sum = 0;

      for (let j = 0; j < subarray.length; j++) {
        sum += subarray[j];
      }

      if (sum > threshold) {
        if (i + 1 < test11.length) {
          test11[i + 1].unshift(subarray.pop());
        }
      }

      test11Transformed.push(subarray);
    }

    console.log(test11Transformed);

    var opt = {
      margin: 1,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // New Promise-based usage:
    const test2 = [];
    let currentArr = [];
    html2pdf()
      .set(opt)
      .from(contentRef.current)
      .save()
      .then(() => {
        const res = [...entityRef.current.children].map((item, i) => {
          const total = [...item.children].map((child, k) => {
            return child.clientHeight;
          });

          return total;

          // const totalHeigh = total.reduce((acc, current) => acc + current);
          // return totalHeigh;
        });

        // console.log(res);

        const dataEntites = data1.map((e) => {
          return e.pages[0].entities;
        });

        // console.log(dataEntites);
      });
  };

  return (
    <>
      <a href={url} download={"my-pdf-document.pdf"}>
        test
      </a>
      <button onClick={convertToPdf}>Convert to PDF</button>
      <div className="container" ref={contentRef}>
        <div className="pageA4" ref={entityRef}>
          {data1.map((e) =>
            e.pages?.map((page, idx) => (
              <div className="pageContent">
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

                {/* <div className="sign">
                  <span>امضاومهر کارگزاری</span>
                  <span>امضاومهر مشتری</span>
                </div> */}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Sechma;

const test44 = [
  [
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
  ],
  [
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
  ],
  [
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
  ],
  [
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
  ],

  [
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
    { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
  ],
];
