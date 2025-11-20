import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';

function HeatmapViz({ data, columns, onDownload }) {
    const [xAxis, setXAxis] = useState(columns[0]);
    const [yAxis, setYAxis] = useState(columns[1] || columns[0]);
    const [valueColumn, setValueColumn] = useState(columns[2] || columns[1] || columns[0]);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const heatmapData = useMemo(() => {
        const matrix = {};
        const xLabels = new Set();
        const yLabels = new Set();

        data.forEach(row => {
            const x = String(row[xAxis]);
            const y = String(row[yAxis]);
            const val = parseFloat(row[valueColumn]);

            if (!isNaN(val)) {
                xLabels.add(x);
                yLabels.add(y);

                if (!matrix[y]) matrix[y] = {};
                matrix[y][x] = (matrix[y][x] || 0) + val;
            }
        });

        const xArray = Array.from(xLabels).slice(0, 20);
        const yArray = Array.from(yLabels).slice(0, 20);
        const zArray = yArray.map(y => xArray.map(x => matrix[y]?.[x] || 0));

        return { x: xArray, y: yArray, z: zArray };
    }, [data, xAxis, yAxis, valueColumn]);

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
                    <label className="block text-sm font-bold mb-2">Y-Axis</label>
                    <Select
                        value={{ value: yAxis, label: yAxis }}
                        onChange={(opt) => setYAxis(opt.value)}
                        options={columnOptions}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Value (Numeric)</label>
                    <Select
                        value={{ value: valueColumn, label: valueColumn }}
                        onChange={(opt) => setValueColumn(opt.value)}
                        options={columnOptions}
                    />
                </div>
            </div>

            <div className="mb-4">
                <button
                    onClick={() => onDownload('heatmap')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Download Chart
                </button>
            </div>

            <Plot
                data={[{
                    x: heatmapData.x,
                    y: heatmapData.y,
                    z: heatmapData.z,
                    type: 'heatmap',
                    colorscale: 'Viridis',
                    hovertemplate: '%{y}, %{x}<br>Value: %{z}<extra></extra>'
                }]}
                layout={{
                    title: `${valueColumn} Heatmap`,
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    height: 500
                }}
                style={{ width: '100%' }}
                config={{ responsive: true }}
            />

            <div className="mt-4 text-sm text-gray-600">
                Conditional formatting with color intensity (limited to 20x20 for performance)
            </div>
        </div>
    );
}

export default HeatmapViz;