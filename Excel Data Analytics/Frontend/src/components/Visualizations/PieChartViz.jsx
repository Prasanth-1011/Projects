import React, { useState, useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import Select from "react-select";

/**
 * Universal Pie Chart visualization
 * Works with any Excel / CSV dataset with automatic numeric detection and cleaning
 */
function PieChartViz({ data, columns, onDownload }) {
    const [labelColumn, setLabelColumn] = useState(columns[0]);
    const [valueColumn, setValueColumn] = useState(columns[1] || columns[0]);
    const [filterColumn, setFilterColumn] = useState(null);
    const [filterValues, setFilterValues] = useState([]);

    // Build dropdown options for all columns
    const columnOptions = columns.map((col) => ({ value: col, label: col }));

    /**
     * 🔹 Step 1: Filter data if a filter is applied
     */
    const filteredData = useMemo(() => {
        if (!filterColumn || filterValues.length === 0) return data;
        return data.filter((row) => filterValues.includes(row[filterColumn]));
    }, [data, filterColumn, filterValues]);

    /**
     * 🔹 Step 2: Safely parse numeric values from Excel-like data
     * Handles $, commas, %, empty strings, and other symbols
     */
    const parseNumber = (val) => {
        if (val == null) return NaN;
        // Remove everything except digits, dot, minus
        const cleaned = String(val).replace(/[^0-9.-]+/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? NaN : parsed;
    };

    /**
     * 🔹 Step 3: Aggregate values by label column
     */
    const chartData = useMemo(() => {
        if (!labelColumn || !valueColumn) return [];

        const grouped = {};
        filteredData.forEach((row) => {
            const key = row[labelColumn] ?? "Unknown";
            const val = parseNumber(row[valueColumn]);
            if (!isNaN(val)) {
                grouped[key] = (grouped[key] || 0) + val;
            }
        });

        const result = Object.entries(grouped).map(([name, value]) => ({
            name,
            value,
        }));

        return result.length > 0 ? result : [];
    }, [filteredData, labelColumn, valueColumn]);

    /**
     * 🔹 Step 4: Extract unique filter options
     */
    const filterValueOptions = useMemo(() => {
        if (!filterColumn) return [];
        const unique = [...new Set(data.map((row) => row[filterColumn]))];
        return unique.map((val) => ({ value: val, label: val }));
    }, [data, filterColumn]);

    const COLORS = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#A569BD",
        "#5DADE2",
        "#F1948A",
        "#52BE80",
        "#D35400",
        "#7F8C8D",
    ];

    return (
        <div>
            {/* Column Selectors */}
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>Label Column:</label>
                <Select
                    options={columnOptions}
                    value={{ value: labelColumn, label: labelColumn }}
                    onChange={(selected) => setLabelColumn(selected.value)}
                />

                <label style={{ marginLeft: 20, marginRight: 10 }}>Value Column:</label>
                <Select
                    options={columnOptions}
                    value={{ value: valueColumn, label: valueColumn }}
                    onChange={(selected) => setValueColumn(selected.value)}
                />
            </div>

            {/* Filter Section */}
            <div style={{ marginBottom: 20 }}>
                <label style={{ marginRight: 10 }}>Filter by Column:</label>
                <Select
                    options={[{ value: null, label: "None" }, ...columnOptions]}
                    value={
                        filterColumn
                            ? { value: filterColumn, label: filterColumn }
                            : { value: null, label: "None" }
                    }
                    onChange={(selected) => {
                        setFilterColumn(selected.value);
                        setFilterValues([]);
                    }}
                />

                {filterColumn && (
                    <div style={{ marginTop: 10 }}>
                        <label style={{ marginRight: 10 }}>Filter Values:</label>
                        <Select
                            options={filterValueOptions}
                            isMulti
                            value={filterValues.map((val) => ({ value: val, label: val }))}
                            onChange={(selected) =>
                                setFilterValues(selected.map((opt) => opt.value))
                            }
                        />
                    </div>
                )}
            </div>

            {/* Chart Section */}
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={150}
                            label
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <p className="text-center text-gray-500">
                    No numeric data found. Try selecting a different value column.
                </p>
            )}

            {/* Download Button */}
            {onDownload && (
                <button
                    onClick={() => onDownload(chartData)}
                    style={{
                        marginTop: 20,
                        background: "#2563eb",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                    }}
                >
                    Download Chart Data
                </button>
            )}
        </div>
    );
}

export default PieChartViz;