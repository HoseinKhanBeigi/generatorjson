import { useRef } from "react";

import { jsPDF } from "jspdf";
import forntjs from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb.ttf";

import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";

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

  const makePdf = () => {
    var pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    // pdf.setR2L(true); //RTL
    pdf.addFont(forntjs, "Amiri", "normal");

    pdf.setFont("Amiri"); // set font

    pdf.setFontSize(10);

    let y = 10;
    let pragraphHeight = y;
    let pageHeight = 10;
    const margin = 10;
    const threshold = pdf.internal.pageSize.height - 2 * margin;
    const pageWidth = pdf.internal.pageSize.width;
    let cursorX = margin;

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

    function reverseEnglishWords(sentence) {
      return sentence.replace(/^[A-Za-z0-9]+\s/, "");
    }

    function rearrangeSentence(sentence) {
      var words = sentence.split(/\s+/);

      if (englishIndex !== -1) {
        var persianIndex = words.findIndex((word) =>
          /^[\u0600-\u06FF]+$/.test(word)
        );
        if (persianIndex !== -1) {
          words.splice(persianIndex + 1, 0);
        }
      }
      var rearrangedSentence = words.join(" ");
      return rearrangedSentence;
    }

    function joinWordsWithDirection(words, separator) {
      let result = "";
      let isEnglish = false;

      words.forEach((word, index) => {
        // Detect if the word contains English characters
        if (/^[a-zA-Z0-9]+$/.test(word)) {
          isEnglish = true;
        }

        // Add separator between words (except for the first word)
        if (index > 0) {
          result += separator;
        }

        // Add the word to the result
        result += word;

        // If the current word is English and the next word is Persian, add a space for separation
        if (
          isEnglish &&
          index < words.length - 1 &&
          /^[^\u0000-\u007F]+$/.test(words[index + 1])
        ) {
          result += " ";
        }
      });

      return result;
    }

    const originalArray = [
      "به",
      "نشانی",
      "سایت",
      "اینترنتی",
      "ggg",
      "شسی",
      "text",
      "888",
      "tetete",
      "شسیشسی",
      "شسیشسی",
      "شسیشسی",
    ];
    let a = "";
    let l = "";
    const tes = `${originalArray[11]} ${originalArray[10]} ${originalArray[9]} ${originalArray[8]} ${originalArray[7]} ${originalArray[6]} ${originalArray[5]} ${originalArray[4]}  ${originalArray[0]} ${originalArray[1]} ${originalArray[2]} ${originalArray[3]} `;
    // console.log(tes);

    originalArray.map((item) => {});

    // Join Persian and English words with a space in between

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
            pragraphHeight = y;
            pageHeight = 0;
            pdf.addPage();
          }

          const lines = pdf.splitTextToSize(item.text, 250);

          let result = [];
          let currentLine = "";
          let isEnglish = false;
          const arr = lines.map((item) => item.split(" ")).flat(Infinity);
          const test = arr.findIndex((item) => /^[A-Za-z]+$/.test(item));
          if (item.text !== undefined) {
            const test2 = item.text?.split(" ");
            const res = test2.findIndex((item) => /^[A-Za-z]/.test(item));
            console.log(res);
          }
          // arr.map((e) => {
          //   if (Array.isArray(e)) {
          //   }
          // });

          for (let i = 0; i < arr.length; i++) {
            const word = arr[i];
            if (/^www\./.test(word)) {
              isEnglish = true;
            }
            if (
              pdf.getStringUnitWidth(currentLine) +
                pdf.getStringUnitWidth(word) <=
              55
            ) {
              if (isEnglish) {
                currentLine += " ";
              }
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
            ? lines.length > 1
              ? result.forEach((line) => {
                  y += 10;
                  pdf.text(
                    reverseEnglishWords(
                      reverseParentheses(reverseDoubleAngleQuotes(line))
                    ),
                    205,
                    y,
                    {
                      align: "right",
                    }
                  );
                })
              : pdf.text(
                  reverseParentheses(reverseDoubleAngleQuotes(item.text)),
                  205,
                  y,
                  {
                    align: "right",
                    rotationDirection: 0,
                  }
                )
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
