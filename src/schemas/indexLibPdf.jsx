// eslint-disable-next-line import/no-extraneous-dependencies
import { PDFDocument, rgb } from 'pdf-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import fontkit from '@pdf-lib/fontkit';

const signUrlImg = '../../../static/images/IMG.png';

const fontLight =
  '../../../static/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb_Light.ttf';
const fontBold =
  '../../../static/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb_Medium.ttf';

function toFarsiNumber(n) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  if (/[۰-۹]/g.test(n)) {
    return n;
  } else if (/^-?[0-9]+([.,_-][0-9]+)*([eE][-+]?[0-9]+)?$/.test(n)) {
    return n
      .toString()
      .split('')
      .map(x => farsiDigits[x])
      .join(`${n.includes('-') ? '-' : ''}`);
  }
  return n;
}

const splitTextIntoLines = (text, maxLength, font) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (let i = 0; i <= words.length - 1; i++) {
    const word = toFarsiNumber(reversePersianNumbers(reverseUrl(words[i])));
    const result = `${word} `;
    const wordWidth = font.widthOfTextAtSize(result, 12);
    const wordWidthcurrentLine = font.widthOfTextAtSize(currentLine, 12);
    if (wordWidth + wordWidthcurrentLine <= 540) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }

  lines.push(currentLine.trim());
  return lines;
};

function reverseParentheses(sentence) {
  return sentence?.replace(/[()]/g, function(match) {
    return match === '(' ? ')' : '(';
  });
}

function reverseDoubleAngleQuotes(sentence) {
  return sentence?.replace(/[«»]/g, function(match) {
    return match === '«' ? '»' : '«';
  });
}
const s = [];

function reversedString(sentence) {
  return sentence?.replace(/(\w+)\.(\w+)\.(\w+)/g, function(match) {
    return '$3.$2.$1';
  });
}

function reverseWebUrl(url) {
  if (/(\w+)\.(\w+)\.(\w+)/.test(url)) {
    return url?.replace(/(\w+)\.(\w+)\.(\w+)/, '$3.$2.$1');
  } else {
    return url;
  }
}

function reverseDate(date) {
  return date?.replace(/^(\d{4})\/(\d{2})\/(\d{2})$/, '$3/$2/$1');
}
const dateRegex = /^\d{1,4}[./-]\d{1,2}[./-]\d{1,4}$/;

function reversePersianDate(inputDate) {
  return inputDate
    .split(' ')
    .map(e => {
      if (dateRegex.test(e)) {
        return reverseDate(e);
      } else {
        return e;
      }
    })
    .join(' ');
}

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emailPattern2 = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
function reverseEnglishWordsAndNumbers(text) {
  if (text) {
    return text
      .split(/(\s+|\b)/)
      .map(word => {
        if (/^[a-zA-Z0-9]+$/.test(word)) {
          if (emailPattern2.test(word)) {
            return word;
          } else {
            return word
              .split('')
              .reverse()
              .join('');
          }
        } else {
          return word;
        }
      })
      .join('');
  }
}

function reverseUrl(input) {
  // Regular expression to match a web URL
  const urlPattern = /^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i;

  // Extract the matched groups
  const match = input.match(urlPattern);

  if (match) {
    const protocol = match[1] || ''; // Check if "https://" is present
    const domain = match[2];
    const path = match[3] || '';

    // Reconstruct the reversed URL
    const reversedUrl = `${protocol}${domain
      .split('')
      .reverse()
      .join('')}`;
    return reversedUrl;
  } else {
    return input;
  }
}

function reverseEnglishNumbers(text) {
  if (text) {
    return text
      .split(/(\s+|\b)/)
      .map(word => {
        if (/^[0-9]+$/.test(word)) {
          return word
            .split('')
            .reverse()
            .join('');
        } else {
          return word;
        }
      })
      .join('');
  }
}

function reversePersianNumbers(inputString) {
  if (/[۰-۹]/g.test(inputString)) {
    return inputString
      .split('')
      .reverse()
      .join('');
  }
  return inputString;
}

const paragraphWithThreeDots = (
  item,
  data,
  page,
  width,
  height,
  heightThreshold,
  regularFont,
  line,
) => {
  if (line) {
    if (item.values) {
      const resultArray = [];
      let replacementIndex = 0;
      const dotPattern = /\.{3,}/g;
      const valuess = [];
      const result = line?.split(/(\.{3,})/);

      if (data) {
        const res = item?.names?.map(name => {
          if (Array.isArray(name)) {
            return `${data[name[0]]}-${data[name[1]]}`;
          }

          return data[name];
        });
        if (item.names) {
          res.map(el => valuess.push(el));
        }
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const sentence of result) {
        if (dotPattern.test(sentence)) {
          resultArray.push(valuess[replacementIndex]);
          replacementIndex++;
          const idx = resultArray.findIndex(
            e =>
              e === '' ||
              e === undefined ||
              (typeof e === 'object' && e?.props?.children[1] === ''),
          );

          if (idx !== -1) {
            resultArray[idx] = '...';
          }
        } else {
          resultArray.push(sentence);
        }
      }

      const lines = splitTextIntoLines(
        resultArray
          .map(e =>
            reverseEnglishNumbers(reverseEmail(reversePersianNumbers(e))),
          )
          .join(''),
        100,
        regularFont,
      );

      lines.forEach((el, index) => {
        page.drawText(reverseParentheses(reverseDoubleAngleQuotes(el)), {
          size: 12,
          x: width - regularFont.widthOfTextAtSize(el, 12) - 20,
          y: height - heightThreshold - index * 24 + 10,
          font: regularFont,
        });
      });
      // heightThreshold += 10 * lines.length;
    }
  }
};

function signitureImage(imgUrl) {
  if (imgUrl) {
    const base64Image = imgUrl.split(';base64,').pop();
    const decode = atob(base64Image);
    const byteNumbers = new Array(decode.length);
    for (let i = 0; i < decode.length; i++) {
      byteNumbers[i] = decode.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers).buffer;
    return byteArray;
  }
}

function sliceArray(originalArray) {
  return originalArray.reduce((result, item) => {
    let slicedEntities = [];

    item.pages[0].entities.forEach(entity => {
      if (entity.breakDownPage === true) {
        // If "breakDownPage" is true, push the current slice and reset for the next chunk
        if (slicedEntities.length > 0) {
          result.push({ pages: [{ entities: slicedEntities }] });
          slicedEntities = [];
        }
      } else {
        slicedEntities.push(entity);
      }
    });

    // Push the remaining entities if any
    if (slicedEntities.length > 0) {
      result.push({ pages: [{ entities: slicedEntities }] });
    }

    return result;
  }, []);
}

function reverseEmail(sentence) {
  // Regular expression to detect email
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

  // Find the email using regex
  const match = sentence?.match(emailPattern);

  if (sentence !== undefined) {
    if (match) {
      const detectedEmail = match[0];
      const reversedEmail = detectedEmail
        .split('')
        .reverse()
        .join('');
      return reversedEmail;
    } else {
      return sentence;
    }
  }
}

function reverseEmailFormat(input) {
  // Regular expression to match the pattern
  const regex = /com\.gmail@([A-Za-z0-9_]+)_([A-Za-z0-9]+)_tset/;

  // Extract the matched groups
  const match = input.match(regex);

  if (match) {
    const part1 = match[1];
    const part2 = match[2];

    // Reconstruct the reversed email
    const reversedEmail = `${part1}_${part2}@gmail.com`;
    return reversedEmail;
  } else {
    return input;
  }
}

async function createPdf(data1, dataVal, signitureImageUrl, nameForm) {
  const data = dataVal;
  // reversePersianNumbers(
  // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-shadow
  for (const item in data) {
    if (!Array.isArray(data[item]) && typeof data[item] === 'string') {
      data[item] = reversePersianDate(reversePersianNumbers(data[item]));
    }
  }
  const pdfDoc = await PDFDocument.create();
  const fontBytes = await fetch(fontLight).then(response =>
    response.arrayBuffer(),
  );

  const fontBoldBytes = await fetch(fontBold).then(response =>
    response.arrayBuffer(),
  );

  const signImageByte = await fetch(signUrlImg).then(res => res.arrayBuffer());
  const signitureImageByte = signitureImage(signitureImageUrl);
  pdfDoc.registerFontkit(fontkit);
  const regularFont = await pdfDoc.embedFont(fontBytes);
  const boldFont = await pdfDoc.embedFont(fontBoldBytes);
  const signImage = await pdfDoc.embedPng(signImageByte);
  let signitureImagefile = '';
  if (signitureImageByte) {
    signitureImagefile = await pdfDoc?.embedPng(signitureImageByte);
  }
  let heightThreshold = 30;

  const transformedData = sliceArray(data1);

  function valueOfTable(name, dataTable, nestedItemValue) {
    if (dataTable) {
      // if (nestedItemValue) {
      //   return name.map(item => <div>{item}</div>);
      // }
      if (!Array.isArray(name) && name !== undefined) {
        if (name in dataTable) {
          if (name === 'male' && dataTable[name]) {
            return 'مرد';
          } else if (name === 'male' && !dataTable[name]) {
            return 'زن';
          }

          return dataTable[name];
        }
      } else if (Array.isArray(name) && name !== undefined) {
        return `${dataTable[name[0]]}-${dataTable[name[1]]}`;
      }
    }
  }

  transformedData.flat(Infinity).map((e, idx) => {
    return e.pages?.map((pg, index) => {
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      heightThreshold = 30;
      if (nameForm === 'formKhobreganMerged') {
        page.drawText('امضاومهر کارگزاری', {
          x: 60,
          y: 100,
          size: 9,
          font: regularFont,
        });
        page.drawImage(signImage, {
          x: 60,
          y: 10,
          width: 70,
          height: 70,
        });
      }

      if (signitureImagefile) {
        page.drawText('امضاومهر مشتری', {
          x: 460,
          y: 100,
          size: 9,
          font: regularFont,
        });
        page.drawImage(signitureImagefile, {
          x: 460, // X-coordinate of the top-left corner of the image
          y: 10, // Y-coordinate of the top-left corner of the image
          width: 70,
          height: 70,
        });
      }

      // eslint-disable-next-line array-callback-return
      pg.entities.map(item => {
        const tableData = item?.table;
        if (item.text) {
          const lines = splitTextIntoLines(
            reverseEnglishNumbers(item?.text),
            100,
            regularFont,
          );
          if (!item.regex) {
            // eslint-disable-next-line no-shadow
            lines.forEach((line, index) => {
              const textWidth = regularFont.widthOfTextAtSize(line, 12);
              const xPosition = width - textWidth;
              const yPosition = height - heightThreshold - index * 24;

              page.drawText(
                reversePersianDate(
                  reverseParentheses(reverseDoubleAngleQuotes(line)),
                ),
                {
                  align: 'center',
                  size: item.contractTitle === true ? 14 : 12,
                  x:
                    item.contractTitle === true
                      ? xPosition / 2
                      : xPosition - 20,
                  y: yPosition + 10,
                  font:
                    lines.length < 2 &&
                    (item.title === true || item.contractTitle === true)
                      ? boldFont
                      : regularFont,
                },
              );
            });
          } else {
            paragraphWithThreeDots(
              item,
              data,
              page,
              width,
              height,
              heightThreshold,
              regularFont,
              item?.text,
            );
            heightThreshold += 10 * lines.length;
          }
          heightThreshold += 27 * lines.length;
        } else if (item?.table) {
          const rowWidth = 560;
          const cellHeight = 20;

          const tableX = 10;
          let rowIndex = 0;
          for (let row = 0; row < tableData.length; row++) {
            const cellWidth = rowWidth / tableData[row].length;
            rowIndex++;
            for (let col = 0; col < tableData[row].length; col++) {
              const tableY = height - heightThreshold - row;
              const cellX = tableX + (col + 1) * cellWidth;
              let cellY = '';

              if (tableData[row][col].div) {
                cellY = tableY - row * cellHeight * 2;
                rowIndex++;
              }
              cellY = tableY - rowIndex * cellHeight;

              const silverColor = rgb(192 / 255, 192 / 255, 192 / 255);
              page.drawRectangle({
                x: 30 + rowWidth - cellX,
                y: cellY,
                width: rowWidth / tableData[row].length,
                height: tableData[row][col].div ? cellHeight * 2 : cellHeight,
                borderColor: silverColor,
                borderWidth: 1,
              });

              if (tableData[row][col]?.div) {
                const lines = splitTextIntoLines(
                  tableData[row][col]?.text,
                  100,
                  regularFont,
                );
                let MultiLineIndex = 0;
                lines.forEach((line, ind) => {
                  MultiLineIndex++;
                  page.drawText(
                    reverseParentheses(reverseDoubleAngleQuotes(line)),
                    {
                      size: 11,
                      x:
                        25 +
                        rowWidth -
                        cellX +
                        cellWidth -
                        regularFont.widthOfTextAtSize(line, 11),
                      y: cellY + 35 + -MultiLineIndex * 13,
                      font: regularFont,
                    },
                  );
                });
              } else {
                page.drawText(
                  reverseParentheses(
                    reverseDoubleAngleQuotes(tableData[row][col].text),
                  ),
                  {
                    size: 11,
                    x:
                      25 +
                      rowWidth -
                      cellX +
                      cellWidth -
                      regularFont.widthOfTextAtSize(
                        tableData[row][col].text,
                        11,
                      ),
                    y: cellY + 6,
                    font: regularFont,
                  },
                );
              }

              if (tableData[row][col].name) {
                const dataTable = reverseParentheses(
                  reverseDoubleAngleQuotes(
                    reverseEnglishNumbers(
                      valueOfTable(tableData[row][col].name, data),
                    ),
                  ),
                );
                if (
                  dataTable !== 'undefined-undefined' &&
                  dataTable !== undefined &&
                  page !== undefined
                ) {
                  page?.drawText(
                    reverseParentheses(
                      reverseDoubleAngleQuotes(
                        reverseEnglishNumbers(
                          valueOfTable(tableData[row][col].name, data),
                        ),
                      ),
                    ),
                    {
                      size: 12,
                      x:
                        15 +
                        rowWidth -
                        cellX +
                        cellWidth -
                        regularFont.widthOfTextAtSize(
                          tableData[row][col].text,
                          11,
                        ) -
                        regularFont.widthOfTextAtSize(
                          valueOfTable(tableData[row][col].name, data),
                          12,
                        ),
                      y: cellY + 6,
                      font: boldFont,
                    },
                  );
                }
              }
            }
          }

          heightThreshold += cellHeight * tableData.length + 54;
        }
      });
      if (
        transformedData[0].pages[0].entities[0].text.includes(
          'قرارداد استفاده از خدمات برخط',
        ) &&
        idx === transformedData.length - 1
      ) {
        let corrcetCounter = 0;
        const arr = [];
        // eslint-disable-next-line array-callback-return
        pg.entities.map(entity => {
          if (entity?.txt !== undefined) {
            arr.push(entity?.txt);
            entity?.txt?.options?.map(option => {
              arr.push({
                ...option,
                answer: entity.txt.answer,
                submittedAnswer: entity.txt.submittedAnswer,
              });
            });
          }
        });
        let i = 0;
        // eslint-disable-next-line no-shadow
        arr.forEach((line, idx) => {
          const optionText = line.optionNumber
            ? line.optionNumber.toString().concat(' ( ', line.body)
            : line.body;
          const textWidth = regularFont.widthOfTextAtSize(optionText, 10);
          const xPosition = width - textWidth;
          const yPosition = height - heightThreshold - idx * 18;
          const redColor = rgb(192 / 255, 0, 0);
          const greenColor = rgb(0, 192 / 255, 0);
          const blackColor = rgb(0, 0, 0);
          i += 1;
          if (line.questionNumber !== undefined) {
            i = 0;
          }

          if (
            line.questionNumber !== undefined &&
            line.answer === line.submittedAnswer
          ) {
            corrcetCounter += 1;
          }
          page.drawText(optionText, {
            x: xPosition - 20,
            y: yPosition + 10,
            size: 10,
            font: line.questionNumber === undefined ? regularFont : boldFont,
            color:
              // eslint-disable-next-line no-nested-ternary
              line.questionNumber === undefined
                ? // eslint-disable-next-line no-nested-ternary
                  line.answer === line.submittedAnswer
                  ? line.submittedAnswer === i
                    ? greenColor
                    : blackColor
                  : line.submittedAnswer === i
                  ? redColor
                  : blackColor
                : blackColor,
          });
          heightThreshold += 3;
        });
        heightThreshold += 5;
        const newTableData = [
          { text: `تعداد جواب درست:  `, value: corrcetCounter },
          { text: `تعداد جواب غلط:  `, value: arr.length / 5 - corrcetCounter },
          {
            text: `نتیجه آزمون:  `,
            value: corrcetCounter >= 4 ? 'قبول' : 'رد',
          },
        ];
        const rowWidth = 560;
        const cellHeight = 25;
        const tableX = 10;
        const cellWidth = rowWidth / 3;
        for (let col = 0; col < 3; col++) {
          const tableY = 250;
          const cellX = tableX + (col + 1) * cellWidth;
          const cellY = tableY - cellHeight;
          const silverColor = rgb(192 / 255, 192 / 255, 192 / 255);
          const redColor = rgb(192 / 255, 0, 0);
          const greenColor = rgb(0, 192 / 255, 0);
          page.drawRectangle({
            x: 30 + rowWidth - cellX,
            y: cellY,
            width: rowWidth / 3,
            height: cellHeight,
            borderColor: silverColor,
            borderWidth: 1,
          });

          page.drawText(
            reverseParentheses(
              reverseDoubleAngleQuotes(newTableData[col].text),
            ),
            {
              size: 12,
              x:
                25 +
                rowWidth -
                cellX +
                cellWidth -
                regularFont.widthOfTextAtSize(newTableData[col].text, 12),
              y: cellY + 6,
              font: regularFont,
            },
          );
          page.drawText(newTableData[col].value.toString(), {
            size: 12,
            x:
              25 +
              rowWidth -
              cellX +
              cellWidth -
              regularFont.widthOfTextAtSize(newTableData[col].text, 12) -
              regularFont.widthOfTextAtSize(
                newTableData[col].value.toString(),
                12,
              ),
            y: cellY + 6,
            font: regularFont,
            // eslint-disable-next-line no-nested-ternary
            color: newTableData[col].text.includes('نتیجه')
              ? corrcetCounter >= 4
                ? greenColor
                : redColor
              : newTableData[col].text.includes('درست')
              ? greenColor
              : redColor,
          });
        }
      }
    });
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'mixed-text.pdf';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return blob;
}

export default createPdf;
