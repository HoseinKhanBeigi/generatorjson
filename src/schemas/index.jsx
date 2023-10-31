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
    var opt = {
      margin: 1,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    const contents = [
      [
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی1" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی2" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی3" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی4" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی5" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی6" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی7" },
        { text: "قرارداد فی­مابین مشتری و کارگزار- قرارداد آتی8" },
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
        { text: "Aقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Bقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Cقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Dقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Fقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Eقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Tقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Gقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Hقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Jقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Lقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Oقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Pقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Zقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Xقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
        { text: "Yقرارداد فی­مابین مشتری و کارگزار- قرارداد آتی" },
      ],
    ];

    const heights = [
      [221, 42, 21, 21, 284, 42, 21, 365],
      [0, 21, 458, 21, 200],
      [0, 21, 932],
      [0, 21, 407],
      [
        211, 142, 142, 142, 163, 220, 321, 442, 521, 1110, 20, 0, 21, 21, 21,
        20, 21,
      ],
    ];

    const threshold = 471;
    const result = [];

    heights.forEach((arr, i) => {
      let currentSubarray = [];
      let currentSum = 0;

      for (let j = 0; j < arr.length; j++) {
        currentSubarray.push(contents[i][j]);
        currentSum += arr[j];
        if (currentSum > threshold) {
          result.push(currentSubarray);
          currentSubarray = [];
          currentSum = 0;
        }
      }

      if (currentSubarray.length > 0) {
        result.push(currentSubarray);
      }
    });

    console.log(result);

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
