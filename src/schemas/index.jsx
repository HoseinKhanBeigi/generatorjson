import { useRef } from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import jsPDF from "./pdfjs/src/index";
import html2pdf from "./pdf/index";
// import rtlcss from "rtl-css-js";

// import bidiFactory from "bidi-js";
// or: const bidiFactory = require('bidi-js')

import forntjs from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb.ttf";

import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";

function Sechma() {
  // const bidi = bidiFactory();
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

  function reverseParentheses(sentence) {
    return sentence.replace(/[()]/g, function (match) {
      return match === "(" ? ")" : "(";
    });
  }

  function reverseDoubleAngleQuotes(sentence) {
    return sentence.replace(/[«»]/g, function (match) {
      return match === "«" ? "»" : "«";
    });
  }

  const convertToPdf = async () => {
    var opt = {
      margin: 0,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.5 },
      html2canvas: {
        scale: 1,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: false,
      },
      jsPDF: {
        unit: "in",
        format: "A4",
        orientation: "portrait",
        compress: true,
      },
    };

    await html2pdf()
      .set(opt)
      .from(contentRef.current)
      .save()
      .outputPdf()
      .then((pdf) => {
        // console.log(pdf);
      });
  };

  const makePdf = async () => {
    var pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    // pdf.setR2L(true); //RTL
    const fontData = await fetch(forntjs).then((response) =>
      response.arrayBuffer()
    );

    // Use the font in the PDF
    pdf.addFileToVFS("IRANSansWeb.ttf", fontData);
    pdf.addFont(forntjs, "Arial", "normal");
    // pdf.addFont(forntjs, "Amiri", "normal");

    pdf.setFont("Arial");

    pdf.setFontSize(10);

    let y = 10;
    let pageHeight = 10;
    const margin = 10;
    const threshold = pdf.internal.pageSize.height - 2 * margin;

    data1.map((e, idx) =>
      e.pages?.map((page) => {
        page.entities.map((item, idx) => {
          if (item?.table?.length > 5) {
            pageHeight = threshold;
          } else {
            pageHeight += 25;
          }

          if (pageHeight > threshold) {
            y = 10;
            // pragraphHeight = y;
            pageHeight = 0;
            pdf.addPage();
          }

          let currentLine = "";
          const result = [];
          const arr = item.text?.split(" ");
          let word = "";

          for (let i = 0; i < arr?.length; i++) {
            word = arr[i];

            if (pdf.getStringUnitWidth(currentLine) <= 55) {
              if (currentLine !== "") {
                currentLine += " ";
              }
              currentLine += `${word}`;
            } else {
              result.push(currentLine);
              currentLine = `${word}`;
            }
          }
          if (currentLine !== "") {
            result.push(currentLine);
          }

          item.id !== "table"
            ? arr.length > 1
              ? result.forEach((line) => {
                  y += 10;
                  pdf.text(line, 205, y, {
                    align: "right",
                  });
                })
              : pdf.text(item.text, 205, y, {
                  align: "right",
                  rotationDirection: 0,
                })
            : pdftable(item?.table, pdf, y);

          y += item.id !== "table" ? 10 : item?.table.length * 10 + 10;
        });
      })
    );
    pdf.save("generated-pdf.pdf");
  };

  const pdftable = (tableContent, pdf, y) => {
    const columnWidths = [95, 95];

    tableContent.forEach((row) => {
      let x = 10;
      if (row.length < 2) {
        row.forEach((cell, columnIndex) => {
          pdf.text(cell.text, x + 2, y + 8);
          pdf.rect(x, y, 190, 10);
          x += columnWidths[columnIndex];
        });
      } else {
        row.forEach((cell, columnIndex) => {
          pdf.text(cell.text, x + 2, y + 8);
          pdf.rect(x, y, 95, 10);
          x += columnWidths[columnIndex];
        });
      }
      y += 10;
    });
  };

  return (
    <>
      <div className="btnContainer">
        <button onClick={makePdf}>makePdf</button>
      </div>
      <div className="container" ref={contentRef}>
        <div className="pageA4">
          {data1.map((e) =>
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
      <button>Convert to PDF</button>
    </>
  );
}

export default Sechma;
