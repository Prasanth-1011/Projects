import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Select from 'react-select';

function BarChartViz({ data, columns, onDownload }) {
    const [xAxis, setXAxis] = useState(columns[0]);
    const [yAxis, setYAxis] = useState(columns[1] || columns[0]);
    const [filterColumn, setFilterColumn] = useState(null);
    const [filterValues, setFilterValues] = useState([]);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const filteredData = useMemo(() => {
        if (!filterColumn || filterValues.length === 0) return data;
        return data.filter(row => filterValues.includes(row[filterColumn]));
    }, [data, filterColumn, filterValues]);

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

        // Optionally calculate average instead of sum
        return Object.values(grouped).map(group => ({
            name: group.name,
            value: group.value, // or: group.value / group.count
        }));
    }, [filteredData, xAxis, yAxis]);

    // Get unique values for selected filter column
    const filterValueOptions = useMemo(() => {
        if (!filterColumn) return [];
        const unique = [...new Set(data.map(row => row[filterColumn]))];
        return unique.map(val => ({ value: val, label: val }));
    }, [data, filterColumn]);

    return (
        <div>
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>X-Axis:</label>
                <Select
                    options={columnOptions}
                    value={{ value: xAxis, label: xAxis }}
                    onChange={selected => setXAxis(selected.value)}
                />
                <label style={{ marginRight: 10, marginLeft: 20 }}>Y-Axis:</label>
                <Select
                    options={columnOptions}
                    value={{ value: yAxis, label: yAxis }}
                    onChange={selected => setYAxis(selected.value)}
                />
            </div>

            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>Filter by Column:</label>
                <Select
                    options={[{ value: null, label: 'None' }, ...columnOptions]}
                    value={filterColumn ? { value: filterColumn, label: filterColumn } : { value: null, label: 'None' }}
                    onChange={selected => {
                        setFilterColumn(selected.value);
                        setFilterValues([]); // Reset filter values
                    }}
                />
                {filterColumn && (
                    <div style={{ marginTop: 10 }}>
                        <label style={{ marginRight: 10 }}>Filter Values:</label>
                        <Select
                            options={filterValueOptions}
                            isMulti
                            value={filterValues.map(val => ({ value: val, label: val }))}
                            onChange={selected => setFilterValues(selected.map(opt => opt.value))}
                        />
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>

            {onDownload && (
                <button onClick={() => onDownload(chartData)} style={{ marginTop: 20 }}>
                    Download Chart Data
                </button>
            )}
        </div>
    );
}

export default BarChartViz;
