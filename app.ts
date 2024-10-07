import fs from "fs";
import path from "path";
import {parse} from 'csv-parse';

export async function processQuery(query: string) {
    // splitting the query into projection and filter parts
    let projections;
    let filters;
    try {
        const [projectionPart, filterPart] = query.split(' FILTER ');
        projections = projectionPart.replace('PROJECT ', '').split(', ');
        filters = filterPart.split(' AND ').map(filter => filter.split(' '));
    } catch (e) {
        console.error('Error splitting the query');
        return;
    }

    let data;
    try {
        data = await readCsv().then((data: any) => data);
    } catch (e) {
        console.error('Error reading CSV file');
        return;
    }

    // filtering logic
    const filteredData = data.filter((row: any) => {
        return filters.every(([column, operator, value]) => {
            switch (operator) {
                case '=':
                    return row[column] == value;
                case '>':
                    return typeof row[column] === 'string' ? row[column].localeCompare(value) > 0 : row[column] > value;
                case '<':
                    return typeof row[column] === 'string' ? row[column].localeCompare(value) < 0 : row[column] < value;
                case '>=':
                    return typeof row[column] === 'string' ? row[column].localeCompare(value) >= 0 : row[column] >= value;
                case '<=':
                    return typeof row[column] === 'string' ? row[column].localeCompare(value) <= 0 : row[column] <= value;
                default:
                    return false;
            }
        });
    });

    // projection logic
    const projectedData = filteredData.map((row: any) => {
        const result: any = {};
        projections.forEach((col: string) => {
            result[col] = row[col];
        });
        return result;
    });

    console.log('Projected Data', projectedData);
}

async function readCsv() {
    const csvFilePath = path.resolve(__dirname, 'files/test_csv.csv');

    const fileContent = fs.readFileSync(csvFilePath, {encoding: 'utf-8'});

    return new Promise((resolve, reject) => {
        const parser = parse(fileContent, {
            delimiter: ',',
            columns: true,
            cast: (value) => {
                if (!isNaN(Number(value))) {
                    return Number(value);
                }
                return value;
            }
        });

        const resultArray: any[] = [];
        // use parser to read every line of the records
        parser.on('readable', function () {
            let record: any;
            while (record = parser.read()) {
                resultArray.push(record);
            }
        });
        parser.on('error', function (err) {
            reject(err);
        });
        //finished reading the file
        parser.on('end', function () {
            resolve(resultArray);
        });
    });
}

// trying out the functions
processQuery('PROJECT Name, Else, some FILTERS Name = asd');
processQuery('PROJECT Name, Else, Number FILTER Number >= 4');