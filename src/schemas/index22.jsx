import { Suspense, lazy, useMemo } from "react";
const SaveAsPDFButton = lazy(() => import("./documentPdf"));

function Sechma() {
  const savepdf = useMemo(() => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <SaveAsPDFButton />
      </Suspense>
    );
  }, []);

  return (
    <div>
      {savepdf}
      asdasdsdad
    </div>
  );
}

export default Sechma;
