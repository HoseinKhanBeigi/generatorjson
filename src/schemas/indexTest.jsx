import { PDFDocument, rgb, degrees } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import forntjs from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb.ttf";
import data1 from "../formDocOne.json";
import "./schema.css";
import Table from "./table";

console.log(data1);

function Sechma() {
  const originalData = [
    {
      pages: [
        {
          entities: [
            {
              text: "۱. در اجرای ماده 14 دستورالعمل اجرایی معاملات بر خط این قرار داد بین شرکت کارگزاری خبرگان سهام (سهامی خاص) به شماره ثبت 111591 و شناسه ملی 10101553125 با نمایندگی آقای ناصر آقاجانی (به سمت مدیرعامل و نائب رئیس هیئت مدیره) و آقای سید محسن حسینی خلیلی (به سمت رئیس هیئت مدیره) به نشانی تهران - ميدان ونك – خيابان گاندي – خيابان بیست و یکم – پلاك 7، کدپستی 1517938314، شماره تلفن 42382 و نشانی سایت اینترنتی www.khobregan.com که از این پس «کارگزار» نامیده می‌شود از یک طرف، و «مشتری» با مشخصات مندرج در جدول زیر از طرف دیگر، به شرح مواد ذیل منعقد گردید:",
            },
            {},
            { breakdownPage: true },
            {},
          ],
        },
      ],
    },
    [
      {
        pages: [
          {
            entities: [{}, {}, { breakdownPage: true }, {}],
          },
        ],
      },
      {
        pages: [
          {
            entities: [{}, {}, { breakdownPage: true }, {}],
          },
        ],
      },
    ],
  ];

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

  console.log(transformedData.flat(Infinity));

  return <></>;
}

export default Sechma;
