import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fontLight from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb_Light.ttf";
import fontBold from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb_Medium.ttf";
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

  function splitTextIntoLines(text, maxLength) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + word).length <= maxLength) {
        currentLine += word + " ";
      } else {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      }
    }
    lines.push(currentLine.trim());
    return lines;
  }
  async function createPdf() {
    const pdfDoc = await PDFDocument.create();
    const fontBytes = await fetch(fontLight).then((response) =>
      response.arrayBuffer()
    );

    const fontBoldBytes = await fetch(fontBold).then((response) =>
      response.arrayBuffer()
    );

    pdfDoc.registerFontkit(fontkit);
    const regularFont = await pdfDoc.embedFont(fontBytes);
    const boldFont = await pdfDoc.embedFont(fontBoldBytes);
    let heightThreshold = 30;

    const transformedData = data1.flatMap((item) => {
      const { pages } = item;

      return pages.map((page) => {
        const { entities } = page;
        const breakDownIndex = entities.findIndex(
          (entity) => entity.breakDownPage === true
        );

        if (breakDownIndex !== -1) {
          const beforeBreakDown = entities.slice(0, breakDownIndex + 1);
          const afterBreakDown = entities.slice(breakDownIndex + 1);

          const result = [
            {
              pages: [
                {
                  entities: beforeBreakDown,
                },
              ],
            },
            {
              pages: [
                {
                  entities: afterBreakDown,
                },
              ],
            },
          ];
          return result;
        }
        return item;
      });
    });

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

    function reverseEnglishWordsAndNumbers(text) {
      return text
        .split(/(\s+|\b)/)
        .map((word) => {
          if (/^[a-zA-Z0-9]+$/.test(word)) {
            return word.split("").reverse().join("");
          } else {
            return word;
          }
        })
        .join("");
    }

    transformedData.flat(Infinity).map((e, idx) =>
      e.pages?.map((pg) => {
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        heightThreshold = 40;

        // page.setFont(regularFont);
        pg.entities.map((item, idx) => {
          const tableData = item?.table;
          if (item.text) {
            const lines = splitTextIntoLines(
              reverseEnglishWordsAndNumbers(item?.text),
              100
            );

            lines.forEach((line, index) => {
              const textWidth = regularFont.widthOfTextAtSize(line, 12);
              const xPosition = width - textWidth;
              const yPosition = height - heightThreshold - index * 24;

              page.drawText(
                reverseParentheses(reverseDoubleAngleQuotes(line)),
                {
                  size: 12,
                  x: xPosition - 20,
                  y: yPosition + 10,
                  font:
                    lines.length < 2 && item.title === true
                      ? boldFont
                      : regularFont,
                }
              );
            });
            heightThreshold += 27 * lines.length;
          } else if (item?.table) {
            const cellWidth = 280;
            const cellHeight = 20;
            let ratio = 0;
            const tableX = 50;
            for (let row = 0; row < tableData.length; row++) {
              for (let col = 0; col < tableData[row].length; col++) {
                const tableY = height - heightThreshold - row;
                const cellX = tableX + col * cellWidth;
                const cellY = tableY - row * cellHeight;

                const lengthTextLetter = tableData[row][col].text.split("");
                const lenText = tableData[row][col].text.split(" ");

                const silverColor = rgb(192 / 255, 192 / 255, 192 / 255);

                page.drawRectangle({
                  x: cellX - 32,
                  y: cellY,
                  width:
                    tableData[row].length === 1 ? cellWidth * 2 : cellWidth,
                  height: cellHeight,
                  borderColor: silverColor,
                  borderWidth: 1,
                });

                ratio = lenText.length < 7 ? lengthTextLetter.length + 100 : 0;

                console.log(cellX);

                page.drawText(tableData[row][col].text, {
                  size: 12,
                  x: cellX + 100,
                  y: cellY + 6,
                  font: regularFont,
                });
              }
              ratio = 0;
            }

            heightThreshold += 27 * tableData.length;
          }
        });
      })
    );
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mixed-text.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <button onClick={createPdf}>createPdf</button>
      <div className="container">
        <div className="pageA4">
          {data1.map((e) =>
            e.pages?.map((page, index) => {
              return (
                <div
                  key={index}
                  className="pageContent"
                  style={{ marginBottom: "5px", marginTop: "3px" }}
                >
                  {page.entities.map((item, i) => {
                    return (
                      <div key={i}>
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
    </>
  );
}

export default Sechma;
