import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
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
    const fontBytes = await fetch(forntjs).then((response) =>
      response.arrayBuffer()
    );

    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);
    let heightThreshold = 30;
    console.log(data1);
    data1.map((e, idx) =>
      e.pages?.map((pg) => {
        let page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        heightThreshold = 40;

        page.setFont(customFont);
        pg.entities.map((item, idx) => {
          // heightThreshold += 30;
          const tableData = item?.table;
          if (item.text) {
            const lines = splitTextIntoLines(item?.text, 100);

            lines.forEach((line, index) => {
              const textWidth = customFont.widthOfTextAtSize(line, 12);
              const xPosition = width - textWidth;
              const yPosition = height - heightThreshold - index * 24;

              page.drawText(line, {
                size: 12,
                x: xPosition - 20,
                y: yPosition + 10,
              });
            });
            heightThreshold += 30 * lines.length;
          } else {
            const cellWidth = 280;
            const cellHeight = 20;
            const tableX = 50;
            for (let row = 0; row < tableData.length; row++) {
              for (let col = 0; col < tableData[row].length; col++) {
                const tableY = height - heightThreshold - row;
                const cellX = tableX + col * cellWidth;
                const cellY = tableY - row * cellHeight;
                // console.log(col);
                // Draw cell background

                console.log();

                const lengthTextLetter = tableData[row][col].text.split("");
                const lenText = tableData[row][col].text.split(" ");

                let ratio = 0;

                page.drawRectangle({
                  x: cellX - 32,
                  y: cellY,
                  width:
                    tableData[row].length === 1 ? cellWidth * 2 : cellWidth,
                  height: cellHeight,
                  borderColor: rgb(1, 0, 0),
                  borderWidth: 1,
                  // Color: "black",
                });

                let ratioCol = lenText.length > 5 ? 5 : lenText.length;

                console.log(ratioCol);

                lengthTextLetter.map((e) => {
                  ratio += 5;
                });
                page.drawText(tableData[row][col].text, {
                  size: 12,
                  x: cellX + 230 - ratio,
                  y: cellY + 6,
                });
                ratioCol = 1;
              }
            }
            heightThreshold += 30 * tableData.length;
          }
        });
      })
    );

    // var pdf = new BytescoutPDF();
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
