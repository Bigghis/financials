// import excelToJson from "convert-excel-to-json";
//import XLS_json from "xls-to-json-lc";
import XLSX from 'xlsx';
import fs from "fs"
import path from "path"
// https://nextjs.org/docs/api-reference/data-fetching/get-static-props#reading-files-use-processcwd

// const PATH_DATA = '../../../../data/damodaran/'
// const PATH_DATA = '/'
const PATH_DATA = './data/damodaran/'

const industries = {};
/*
let dataFiles = [];
const readFiles = async (directoryPath) => {
    return await fs.readdir(directoryPath, (err, files) => {
        if (err) {
            dataFiles = [];
            return console.log('Unable to scan directory: ' + err);
        }
        dataFiles = files;
    });
}
*/

export const getData = () => {

    const directoryPath = path.join(process.cwd(), PATH_DATA);
    const dataFiles = fs.readdirSync(directoryPath); //readFiles(directoryPath);
    dataFiles.forEach((file) => {
        const filePath = path.join(directoryPath, file)
// console.log("filePath =", filePath)
        const workbook = XLSX.readFile(filePath, {/* opts */ });

        // we consider second sheet only!
        const secondSheetName = workbook.SheetNames[1];
        const worksheet = workbook.Sheets[secondSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // in data[6] we have headers columns names!
        // get columns
        const headersIndex = file === 'margin.xls' ? 7 : 6;
        const columns = ['industry'] //pass
        for (let i = 2; i < Object.keys(data[headersIndex]).length; i++) {
            if (i === 2) {
                columns.push(data[headersIndex][`__EMPTY`]);
            } else {
                columns.push(data[headersIndex][`__EMPTY_${i - 2}`])
            }
        }

        for (let i = headersIndex + 1; i < data.length; i++) {
            const _elem = {};
            for (let j = 1; j < columns.length; j++) {
                /*if (j === 0) {
                    _elem[columns[j]] = data[i]['Date updated:']
                }*/
                if (j === 1) {
                    _elem[columns[j]] = data[i][`__EMPTY`];
                }
                if (j > 1) {
                    _elem[columns[j]] = data[i][`__EMPTY_${j - 1}`];
                }
            }

            if (industries[data[i]['Date updated:']]) {
                let subElem = industries[data[i]['Date updated:']];
                industries[data[i]['Date updated:']] = { ...subElem, ..._elem }
            } else {
                industries[data[i]['Date updated:']] = _elem
            }
        }
    });

}


const handler = async (req, res) => {

    const results = await getData()
    res.status(200).json({ industries });
}

export default handler;