import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [file, setFile] = useState();

  const importXlsx = async (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    await reader.readAsBinaryString(file);

    /// JSON ///
    const objImport = new Promise((resolve, reject) => {
      reader.onload = (e) => {
        ////Read File
        const bstr = e.target.result;

        ///XLSX
        const wb = XLSX.read(bstr, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
        //////

        /* Get first worksheet or select */
        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        ///// range is Row start
        const data = XLSX.utils.sheet_to_json(ws, { range: 3 });

        const keys = Object.keys(data[0]);

        ////// Map data ////////
        const arrayObject = [];
        for (const i in data) {
          arrayObject.push({
            name: data[i][keys[0]],
          });
        }
        

        resolve(arrayObject);
      };
    });

    Promise.all([objImport]).then((res) => {
      console.log("final Object : ", res);
    });
    console.log(reader);
  };

  return (
    <>
      <div>
        input
        <input
          type={"file"}
          onChange={(e) => {
            console.log(e.target.files[0]);
            setFile(e.target.files[0]);

            importXlsx(e.target.files[0]);
          }}
        ></input>
      </div>
    </>
  );
}
