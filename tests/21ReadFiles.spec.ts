// This test file is intended for reading files and performing related operations.
// txt, excel, db
import { test } from "@playwright/test";
import fs from 'fs';
import xlsx from 'xlsx';
import {DBHandler} from '../datahandle/dbRead';

test('Read txt Files Test', async () => {
    // Implement file reading logic here
    const data = fs.readFileSync('files/demo.txt', 'utf-8');
    console.log(data);
});

test("write data to txt file", async () => {
    const data = "This is some sample text to write to the file.";
    fs.writeFileSync('files/out.txt', data, 'utf-8');
    console.log("Data written to file successfully.");
});

test("Read Excel Files Test", async () => {
    // Implement Excel file reading logic here
    // You can use a library like 'xlsx' to read Excel files
    const workbook = xlsx.readFile('testdata/empdata.xlsx');
    const sheet = workbook.Sheets["Sheet1"];

    type Row = {
        fname: string;
        lname: string;
    };

    const data: Row[] = xlsx.utils.sheet_to_json(sheet);
    console.log(data);

    console.log(data[2].fname);
});

test("Write Excel Files Test", async () => {

    const workbook = xlsx.utils.book_new();

    const sheetData = [
        { fname: "John", lname: "Doe" },
        { fname: "Jane", lname: "Smith" }
    ];
    const sheet = xlsx.utils.json_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, sheet, "Sheet1");
    xlsx.writeFile(workbook, "testdata/out.xlsx");
    console.log("Excel file written successfully.");
});


test("Read txt and write excel", async () => {

    const workbook = xlsx.utils.book_new();

    const sheetData = fs.readFileSync('files/demo.txt', 'utf-8');
    let lines: string[] = sheetData.split('\n');

    const sheet = xlsx.utils.aoa_to_sheet(lines.map(line => line.split('\t')));
    xlsx.utils.book_append_sheet(workbook, sheet, "Sheet1");
    xlsx.writeFile(workbook, "testdata/out1.xlsx");
    console.log("Excel file written successfully.");
});

test("Read MY SQL DB", async () => {

    const dbHandler = new DBHandler();
    await dbHandler.connect('localhost', 'root', 'VibeTestQ', 'company', 3306);
    let data = await dbHandler.readAll('emp');
    console.log(data);
});