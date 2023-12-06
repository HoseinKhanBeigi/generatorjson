import { PDFDocument, rgb } from "pdf-lib";
import fontkit from '@pdf-lib/fontkit';
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

  async function createPdf() {
    const pdfDoc = await PDFDocument.create();
    const fontBytes = await fetch(forntjs).then((response) =>
      response.arrayBuffer()
    );

    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();


    const customFont = await pdfDoc.embedFont(fontBytes);
    
    page.setFont(customFont);
    const textOptions = {  color: rgb(0, 0, 0) };
    page.drawText("1. در اجرای ماده 14 «دستورالعمل اجرایی معاملات برخط»، این قرارداد بین شرکت کارگزاری خبرگان سهام (سهامی خاص) به شماره ثبت 111591 و شناسه ملی 10101553125 با نمایندگی آقای ناصر آقاجانی (به سمت مدیرعامل و نائب رئیس هیئت مدیره) و آقای سید محسن حسینی خلیلی  (به سمت رئیس هیئت مدیره) به نشانی تهران -  ميدان ونك – خيابان گاندي – خيابان بیست و یکم – پلاك 7، کدپستی 1517938314، شماره تلفن 42382 و نشانی سایت اینترنتی www.khobregan.com که از این پس «کارگزار» نامیده می‌شود از یک طرف، و «مشتری» با مشخصات مندرج در جدول زیر از طرف دیگر، به شرح مواد ذیل منعقد گردید:", {size:7 , x: 60, y: height - 70 });
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
