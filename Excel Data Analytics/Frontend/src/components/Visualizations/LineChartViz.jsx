import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Select from 'react-select';

function LineChartViz({ data, columns, onDownload }) {
    const [xAxis, setXAxis] = useState(columns[0]);
    const [yAxis, setYAxis] = useState(columns[1] || columns[0]);
    const [drilldownColumn, setDrilldownColumn] = useState(null);
    const [selectedDrilldown, setSelectedDrilldown] = useState(null);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const filteredData = useMemo(() => {
        if (!selectedDrilldown) return data;
        return data.filter(row => row[drilldownColumn] === selectedDrilldown);
    }, [data, drilldownColumn, selectedDrilldown]);

    const chartData = useMemo(() => {
        const grouped = {};
        filteredData.forEach(row => {
            const key = row[xAxis];
            if (!grouped[key]) {
                grouped[key] = { name: key, value: 0, count: 0 };
            }
            const val = parseFloat(row[yAxis]);
            if (!isNaN(val)) {
                grouped[key].value += val;
                grouped[key].count += 1;
            }
        });
        return Object.values(grouped).sort((a, b) => a.name > b.name ? 1 : -1).slice(0, 50);
    }, [filteredData, xAxis, yAxis]);

    const drilldownOptions = useMemo(() => {
        if (!drilldownColumn) return [];
        const unique = [...new Set(data.map(row => row[drilldownColumn]))];
        return unique.map(val => ({ value: val, label: String(val) }));
    }, [data, drilldownColumn]);

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">X-Axis</label>
                    <Select
                        value={{ value: xAxis, label: xAxis }}
                        onChange={(opt) => setXAxis(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Y-Axis (Numeric)</label>
                    <Select
                        value={{ value: yAxis, label: yAxis }}
                        onChange={(opt) => setYAxis(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Drilldown By</label>
                    <Select
                        value={drilldownColumn ? { value: drilldownColumn, label: drilldownColumn } : null}
                        onChange={(opt) => {
                            setDrilldownColumn(opt?.value || null);
                            setSelectedDrilldown(null);
                        }}
                        options={columnOptions}
                        isClearable
                        placeholder="Select column..."
                    />
                </div>
            </div>

            {drilldownColumn && (
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">Select Drilldown Value</label>
                    <Select
                        value={selectedDrilldown ? { value: selectedDrilldown, label: String(selectedDrilldown) } : null}
                        onChange={(opt) => setSelectedDrilldown(opt?.value || null)}
                        options={drilldownOptions}
                        isClearable
                        placeholder="All data..."
                    />
                </div>
            )}

            <div className="mb-4">
                <button
                    onClick={() => onDownload('line_chart')}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    Download Chart
                </button>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-600">
                {selectedDrilldown ? `Drilled down to: ${selectedDrilldown}` : 'Showing all data'} | {chartData.length} points
            </div>
        </div>
    );
}

export default LineChartViz;