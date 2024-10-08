import { processQuery } from './app';
import fs from 'fs';
import path from 'path';

jest.mock('fs');
jest.mock('path');

const mockCsvData = `Name,Else,Number
asd,some,5
qwe,other,3`;

const mockCsvDataWrong = `Name,Else,Number
asd,some,5,extra
qwe,other,3`;

beforeAll(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvData);
    (path.resolve as jest.Mock).mockReturnValue('mocked/path/to/csv');
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
        (fs.readFileSync as jest.Mock).mockReturnValue(mockCsvDataWrong);
        console.error = jest.fn();
        await processQuery('PROJECT Name, Else FILTER Name = asd');
        expect(console.error).toHaveBeenCalledWith('Invalid Record Length: columns length is 3, got 4 on line 2');
    })

    it('should handle invalid query', async () => {
        console.error = jest.fn();
        await processQuery('PROJECT Name, Else INVALID Name = asd');
        expect(console.error).toHaveBeenCalledWith('Cannot read properties of undefined (reading \'split\')');
    });
});