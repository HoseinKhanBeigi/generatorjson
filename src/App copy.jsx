import "./App.css";
import data from "./jsons/freezehoghoghi.json";

function App() {
  const renderParagraph = (paragraph) => {
    return (
      <p>
        {paragraph?.inputes?.map((item, index) => (
          <span key={index}>
            &nbsp;{item.text} &nbsp; {item.input.value}&nbsp;
          </span>
        ))}
      </p>
    );
  };

  const renderTable = (tableArray) => {
    return (
      <div className="table">
        {tableArray?.map((row, index) => (
          <div key={index} className="row">
            {row.map((col, index) => (
              <div key={index} className="col">
                {col?.inputes?.map((item, index) => (
                  <span key={index}>
                    &nbsp;{item.text} &nbsp; {item.input.value}&nbsp;
                  </span>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderEntity = (entity) => {
    return (
      <>
        <h2>{entity.title}</h2>
        <>
          {entity?.table?.length !== undefined
            ? renderTable(entity?.table)
            : ""}
        </>
        {entity?.paragraphes?.map((paragraph) => renderParagraph(paragraph))}
      </>
    );
  };

  const renderPage = (page) => {
    return (
      <div className="page" style={{ textAlign: "right" }}>
          {/* eslint-disable-next-line no-prototype-builtins */}
          {page.hasOwnProperty("contractNumber")  || page.hasOwnProperty("contractDate") ? (
              <div className="contract-details">
              <span>
                  شماره قرارداد:
                  {page?.contractNumber}
              </span>
                  <span>
                  تاریخ قرارداد:
                      {page?.contractDate}
              </span>
              </div>
          ) : null }
        {page?.entities?.map((entity) => renderEntity(entity))}
   {/* eslint-disable-next-line no-prototype-builtins */}
        {page?.hasOwnProperty("sign") && (
          <div className="sign">
            <span>امضاومهر کارگزاری</span>
            <span>امضاومهر مشتری</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ direction: "rtl" }} className="page">
      <div className="logos">
        {data.logos?.map((logo, index) => (
          <img key={index} src={logo} alt="logo" className="logo" />
        ))}
      </div>
      <h1 className="title">{data.title}</h1>
      <h6>{data.desc}</h6>
      {data?.pages?.map((page) => renderPage(page))}
    </div>
  );
}

export default App;
