const XLSX = require('xlsx');

const parseExcelFile = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        return {
            success: true,
            data: jsonData,
            sheetName: sheetName,
            totalRows: jsonData.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { parseExcelFile };