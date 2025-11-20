import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function PivotTableViz({ data, columns, onDownload }) {
    const [rowField, setRowField] = useState(columns[0]);
    const [colField, setColField] = useState(columns[1] || columns[0]);
    const [valueField, setValueField] = useState(columns[2] || columns[1] || columns[0]);
    const [aggregation, setAggregation] = useState('sum');
    const [showChart, setShowChart] = useState(false);

    const columnOptions = columns.map(col => ({ value: col, label: col }));
    const aggOptions = [
        { value: 'sum', label: 'Sum' },
        { value: 'avg', label: 'Average' },
        { value: 'count', label: 'Count' }
    ];

    const pivotData = useMemo(() => {
        const pivot = {};
        const colSet = new Set();

        data.forEach(row => {
            const rowKey = String(row[rowField]);
            const colKey = String(row[colField]);
            const val = parseFloat(row[valueField]);

            colSet.add(colKey);

            if (!pivot[rowKey]) pivot[rowKey] = {};
            if (!pivot[rowKey][colKey]) pivot[rowKey][colKey] = { sum: 0, count: 0 };

            if (!isNaN(val)) {
                pivot[rowKey][colKey].sum += val;
                pivot[rowKey][colKey].count += 1;
            }
        });

        return { pivot, columns: Array.from(colSet).slice(0, 10) };
    }, [data, rowField, colField, valueField]);

    const getValue = (rowKey, colKey) => {
        const cell = pivotData.pivot[rowKey]?.[colKey];
        if (!cell) return 0;

        switch (aggregation) {
            case 'sum': return cell.sum;
            case 'avg': return cell.count > 0 ? cell.sum / cell.count : 0;
            case 'count': return cell.count;
            default: return 0;
        }
    };

    const chartData = useMemo(() => {
        return Object.keys(pivotData.pivot).slice(0, 10).map(rowKey => {
            const item = { name: rowKey };
            pivotData.columns.forEach(colKey => {
                item[colKey] = getValue(rowKey, colKey);
            });
            return item;
        });
    }, [pivotData, aggregation]);

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Row Field</label>
                    <Select
                        value={{ value: rowField, label: rowField }}
                        onChange={(opt) => setRowField(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Column Field</label>
                    <Select
                        value={{ value: colField, label: colField }}
                        onChange={(opt) => setColField(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Value Field</label>
                    <Select
                        value={{ value: valueField, label: valueField }}
                        onChange={(opt) => setValueField(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Aggregation</label>
                    <Select
                        value={aggOptions.find(o => o.value === aggregation)}
                        onChange={(opt) => setAggregation(opt.value)}
                        options={aggOptions}
                    />
                </div>
            </div>

            <div className="mb-4 flex gap-2">
                <button
                    onClick={() => setShowChart(!showChart)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
                >
                    {showChart ? 'Show Table' : 'Show Chart'}
                </button>
                <button
                    onClick={() => onDownload('pivot_table')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Download
                </button>
            </div>

            {!showChart ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th className="border p-2 bg-gray-100">{rowField} / {colField}</th>
                                {pivotData.columns.map((col, i) => (
                                    <th key={i} className="border p-2 bg-gray-100">{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(pivotData.pivot).slice(0, 20).map((rowKey, i) => (
                                <tr key={i}>
                                    <td className="border p-2 font-bold">{rowKey}</td>
                                    {pivotData.columns.map((colKey, j) => (
                                        <td key={j} className="border p-2 text-right">
                                            {getValue(rowKey, colKey).toFixed(2)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {pivotData.columns.map((col, i) => (
                            <Bar key={i} dataKey={col} fill={`hsl(${i * 40}, 70%, 50%)`} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            )}

            <div className="mt-4 text-sm text-gray-600">
                Pivot table with {aggregation} aggregation | Toggle between table and chart view
            </div>
        </div>
    );
}

export default PivotTableViz;