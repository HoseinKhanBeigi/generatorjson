import { useEffect, useState, useRef, useReducer } from "react";

import html2pdf from "html2pdf.js";
import { jsPDF } from "jspdf";
import forntjs from "../assets/reference/Amiri-Regular.ttf";

import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";

let hr = 1;

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

  const convertToPdf = async () => {
    var opt = {
      margin: 0,
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.5 },
      html2canvas: { scale: 1 },
      jsPDF: {
        unit: "in",
        format: "A4",
        orientation: "portrait",
        compress: "slow",
      },
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
  const handleGeneratePDF = () => {
    // Create a new jsPDF instance with options
    const doc = new jsPDF({
      unit: "mm",
    });

    // Add Persian text to the PDF
    doc.text("سلام دنیا!", 10, 10); // Example Persian text

    // Save the PDF
    doc.save("generated-pdf-with-persian-text.pdf");
  };

  const makePdf = () => {
    var pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addFont(forntjs, "Amiri", "normal");
    pdf.setFont("Amiri"); // set font
    pdf.setFontSize(10);
    let y = 10;
    let pageHeight = 0;
    let hline = 10;
    const margin = 10;

    const threshold = pdf.internal.pageSize.height - 2 * margin;

    const pageWidth = pdf.internal.pageSize.width;
    let cursorX = margin;

    data1.map((e, idx) =>
      e.pages?.map((page) => {
        page.entities.map((item, idx) => {
          pageHeight += 47;
          if (pageHeight > threshold) {
            pdf.addPage();
            y = 10;
            pageHeight = 0;
            hline = 10;
          }

          const lines = pdf.splitTextToSize(item.text, 250);

          console.log(lines);

          item.id !== "table"
            ? lines.length > 1
              ? lines.forEach((line, i) => {
                  hline = 10;
                  y += hline;
                  const textWidth =
                    pdf.getStringUnitWidth(line) * pdf.internal.getFontSize();
                  if (cursorX + textWidth > pageWidth - margin) {
                    cursorX = margin;
                  }

                  pdf.text(line, cursorX, y);
                  cursorX += textWidth + margin; // Move cursor to the right
                })
              : pdf.text(item.text, 205, y, { align: "right" })
            : pdftable(item?.table, pdf, y);

          y += item.id !== "table" ? 10 : item?.table.length * 10 + 10;
        });
      })
    );

    pdf.save("generated-pdf.pdf");
  };

  const handleGeneratePDF1 = () => {
    const pdf = new jsPDF({
      unit: "mm",
    });

    pdf.addFont(forntjs, "Amiri", "normal");
    pdf.setFont("Amiri"); // set font
    pdf.setFontSize(10);

    const content = [
      "موضوع بند 46 ماده 1 و ماده 11 دستورالعمل معاملات قرارداد آتی در بورس اوراق بهادار تهران، مصوب مورخ 16/12/1396 هیئت­مدیره سازمان بورس و اوراق بهادار",
      "ششسی شسی شسی شسی شسی نمیبانست س یبنمتسی بنسنابسنتی باست سیبا سناتیب نستیب نتسنیتباسبسباتس ب",
      ".......شیتنیباتسیتباتسابتاسی.......شسینشسیاستبیلستیبتسبغسنب سعهبهصب س بس",
    ];

    const margin = 10;
    const pageWidth = pdf.internal.pageSize.width;
    console.log(pageWidth);
    let cursorX = margin;
    let cursorY = margin;
    let textnew = "";

    content
      .map((item) => item.split(" "))
      .flat(Infinity)
      .forEach((text, i) => {
        let textWidth = pdf.getStringUnitWidth(text);

        cursorY += 10;

        // Draw the text
        pdf.text(textnew, 205, cursorY, { align: "right" }); // Adjust text position
        cursorX += textWidth + margin; // Move cursor to the right
      });

    pdf.save("generated-pdf-with-text-next-to-each-other.pdf");
  };

  const pdftable = (tableContent, pdf, y) => {
    const columnWidths = [90, 90];

    tableContent.forEach((row) => {
      let x = 10;
      if (row.length < 2) {
        row.forEach((cell, columnIndex) => {
          pdf.text(cell.text, x + 2, y + 8);
          pdf.rect(x, y, 180, 10);
          x += columnWidths[columnIndex];
        });
      } else {
        row.forEach((cell, columnIndex) => {
          pdf.text(cell.text, x + 2, y + 8);
          pdf.rect(x, y, 90, 10);
          x += columnWidths[columnIndex];
        });
      }
      y += 10;
    });
  };

  return (
    <>
      <div className="btnContainer">
        <button onClick={handleGeneratePDF1}>makePdf</button>
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

                  {/* <div className="sign">
                    <span>امضاومهر کارگزاری</span>
                    <span>امضاومهر مشتری</span>
                    <img src="public/vite.svg" />
                  </div> */}
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
