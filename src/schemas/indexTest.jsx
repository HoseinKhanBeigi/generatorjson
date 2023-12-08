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
          entities: [{}, {}, { breakdownPage: true }, {}],
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

  console.log(originalData);

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
        // console.log(result);
        return result;
      }
      // console.log(item);
      return item;
    });
  });

  console.log(transformedData.flat(Infinity));

  return <></>;
}

export default Sechma;
