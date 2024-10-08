import fs from "fs";
import path from "path";
import {parse} from 'csv-parse';

export async function processQuery(query: string): Promise<void> {
    try {
        const { projections, filters } = parseQuery(query);
        const data = await readCsv();
        const filteredData = getFilteredData(data, filters);
        const projectedData = getProjectedData(filteredData, projections);
        console.log('Projected Data', projectedData);
    } catch (e) {
        console.error(e.message);
    }
}

function parseQuery(query: string): { projections: string[], filters: string[][] } {
    const projections = parseProjections(query);
    const filters = parseFilters(query);
    return { projections, filters };
}

function parseProjections(query: string): string[] {
    const projectionPart = query.split(' FILTER ')[0];
    return projectionPart.replace('PROJECT ', '').split(', ');
}

function parseFilters(query: string): string[][] {
    const filterPart = query.split(' FILTER ')[1];
    return filterPart.split(' AND ').map(filter => filter.split(' '));
}

function getFilteredData(data: any[], filters: any[]): any[] {
    return data.filter((row: any) => {
        return filters.every(([column, operator, value]) => {
            return applyFilter(row[column], operator, value);
        });
    });
}

function applyFilter(columnValue: any, operator: string, value: any): boolean {
    switch (operator) {
        case '=':
            return columnValue == value;
        case '>':
            return typeof columnValue === 'string' ? columnValue.localeCompare(value) > 0 : columnValue > value;
        case '<':
            return typeof columnValue === 'string' ? columnValue.localeCompare(value) < 0 : columnValue < value;
        case '>=':
            return typeof columnValue === 'string' ? columnValue.localeCompare(value) >= 0 : columnValue >= value;
        case '<=':
            return typeof columnValue === 'string' ? columnValue.localeCompare(value) <= 0 : columnValue <= value;
        default:
            return false;
    }
}

function getProjectedData(filteredData: any[], projections: string[]): any[] {
    return filteredData.map((row: any) => projectRow(row, projections));
}

function projectRow(row: any, projections: string[]): any {
    const result: any = {};
    projections.forEach((col: string) => {
        result[col] = row[col];
    });
    return result;
}

async function readCsv(): Promise<any[]> {
    const csvFilePath = path.resolve(__dirname, 'files/test_csv.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    return parseCSV(fileContent);
}

function parseCSV(fileContent: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const parser = parse(fileContent, {
            delimiter: ',',
            columns: true,
            cast: castValue
        });

        const resultArray: any[] = [];
        parser.on('readable', function () {
            let record: any;
            while (record = parser.read()) {
                resultArray.push(record);
            }
        });
        parser.on('error', reject);
        parser.on('end', function () {
            resolve(resultArray);
        });
    });
}

function castValue(value: string) {
    if (!isNaN(Number(value))) {
        return Number(value);
    }
    return value;
}

// trying out the functions
processQuery('PROJECT Name, Else, some FILTERS Name = asd');
processQuery('PROJECT Name, Else, Number FILTER Number >= 4');