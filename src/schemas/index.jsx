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

    html2pdf()
      .set(opt)
      .from(contentRef.current)
      .save()
      .outputPdf()
      .then((pdf) => {
        console.log(pdf);
      });

      let worker = await html2pdf().set(options).from(content).toPdf().output('blob').then( (data: Blob) => {
   return data
})
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
