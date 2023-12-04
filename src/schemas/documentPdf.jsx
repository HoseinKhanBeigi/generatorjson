import { memo, useCallback, useMemo } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  BlobProvider,
  Font,
} from "@react-pdf/renderer";
// import IranSansFont from "iransans/web/IRANSansWeb.ttf";

import { saveAs } from "file-saver";

import iransans from "../assets/IRANSans4/WebFonts/fonts/ttf/IRANSansWeb.ttf";

import data1 from "../formDocOne.json";

function MyDocument() {
  Font.register({ family: "IranSans", src: iransans });
  const styles = StyleSheet.create({
    page: {
      display: "flex",
      fontFamily: "IranSans",
      flexDirection: "column",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      padding: 8,
    },
    tableRow: { flexDirection: "row" },
    tableCol: {
      padding: "8px",
      width: "50%",
      borderStyle: "solid",
      borderWidth: 1,
      borderLeftWidth: 1,
      textAlign: "right",
      borderTopWidth: 0,
    },
    cell: {
      fontSize: 10,
      fontFamily: "IranSans",
    },

    section: {
      padding: 8,
      flexWrap: "wrap",
      flexDirection: "row-reverse",
    },
    cell2: {
      fontSize: 10,
      textAlign: "right",
      lineHeight: "1.8rem",
    },
  });

  const daat = useMemo(() => {
    return data1;
  }, []);

  const PagePdf = useCallback((page, idx) => {
    return (
      <Page size="A4" style={styles.page} key={idx}>
        {page?.entities?.map((item) => {
          return (
            <View key={item}>
              {item.id !== "table" ? (
                <View style={styles.section} key={item?.text}>
                  {item?.text?.split(" ").map((word, idx) => {
                    return (
                      <Text style={styles.cell2} key={idx}>
                        {word}
                      </Text>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.table}>
                  {item?.table?.map((row, index) => (
                    <View
                      style={[
                        styles.tableRow,
                        { borderTopWidth: index === 0 ? 1 : 0 },
                      ]}
                      key={index}
                    >
                      {row.map((col) => (
                        <View
                          style={[
                            styles.tableCol,
                            {
                              borderRightWidth: 1,
                              width: row.length === 1 ? "100%" : "50%",
                            },
                          ]}
                          key={col.text}
                        >
                          <Text style={styles.cell}>{col.text}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </Page>
    );
  }, []);

  const ElementPdf = useMemo(() => {
    return (
      <>
        {daat.map((e) =>
          e.pages?.map((page, idx) => {
            return <> {PagePdf(page, idx)}</>;
          })
        )}
      </>
    );
  }, []);

  return <Document>{ElementPdf}</Document>;
}

const SaveAsPDFButton = () => {
  const doc = useMemo(() => {
    return <MyDocument />;
  }, []);
  return (
    <BlobProvider document={doc}>
      {({ blob, url, loading, error }) => {
        return (
          <>
            {loading ? (
              <>loading...</>
            ) : (
              <button
                onClick={() => {
                  saveAs(blob, "document.pdf");
                }}
              >
                Save as PDF
              </button>
            )}
          </>
        );
      }}
    </BlobProvider>
  );
};

export default memo(SaveAsPDFButton);
