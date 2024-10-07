import { processQuery } from './app';
import * as fs from 'fs';
import * as path from 'path';
jest.mock('fs');
jest.mock('path');
const mockCsvData = `Name,Else,Number
asd,some,5
qwe,other,3`;
const mockCsvDataWrong = `Name,Else,Number
asd,some,5,extra
qwe,other,3`;
beforeAll(() => {
    fs.readFileSync.mockReturnValue(mockCsvData);
    path.resolve.mockReturnValue('mocked/path/to/csv');
});
describe('processQuery', () => {
    it('should process query with equality filter', async () => {
        console.log = jest.fn();
        await processQuery('PROJECT Name, Else FILTER Name = asd');
        expect(console.log).toHaveBeenCalledWith('Projected Data', [{ Name: 'asd', Else: 'some' }]);
    });
    it('should process query with greater than or equal filter', async () => {
        console.log = jest.fn();
        await processQuery('PROJECT Name, Else FILTER Number >= 4');
        expect(console.log).toHaveBeenCalledWith('Projected Data', [{ Name: 'asd', Else: 'some' }]);
    });
    it('should handle no matching filters', async () => {
        console.log = jest.fn();
        await processQuery('PROJECT Name, Else FILTER Name = non-existent');
        expect(console.log).toHaveBeenCalledWith('Projected Data', []);
    });
    it('should handle invalid csv data', async () => {
        fs.readFileSync.mockReturnValue(mockCsvDataWrong);
        console.error = jest.fn();
        await processQuery('PROJECT Name, Else FILTER Name = asd');
        expect(console.error).toHaveBeenCalledWith('Error reading CSV file');
    });
    it('should handle invalid query', async () => {
        console.error = jest.fn();
        await processQuery('PROJECT Name, Else INVALID Name = asd');
        expect(console.error).toHaveBeenCalledWith('Error splitting the query');
    });
});
