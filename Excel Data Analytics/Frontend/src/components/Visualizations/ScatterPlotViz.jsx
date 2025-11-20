import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';

function ScatterPlotViz({ data, columns, onDownload }) {
    const [xAxis, setXAxis] = useState(columns[0]);
    const [yAxis, setYAxis] = useState(columns[1] || columns[0]);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const plotData = useMemo(() => {
        const xValues = [];
        const yValues = [];
        const texts = [];

        data.slice(0, 500).forEach(row => {
            const x = parseFloat(row[xAxis]);
            const y = parseFloat(row[yAxis]);
            if (!isNaN(x) && !isNaN(y)) {
                xValues.push(x);
                yValues.push(y);
                texts.push(`${xAxis}: ${x}<br>${yAxis}: ${y}`);
            }
        });

        return [{
            x: xValues,
            y: yValues,
            mode: 'markers',
            type: 'scatter',
            text: texts,
            marker: {
                size: 8,
                color: 'rgb(59, 130, 246)',
                opacity: 0.6
            }
        }];
    }, [data, xAxis, yAxis]);

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">X-Axis (Numeric)</label>
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
            </div>

            <div className="mb-4">
                <button
                    onClick={() => onDownload('scatter_plot')}
                    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                >
                    Download Chart
                </button>
            </div>

            <Plot
                data={plotData}
                layout={{
                    title: `${xAxis} vs ${yAxis}`,
                    xaxis: { title: xAxis },
                    yaxis: { title: yAxis },
                    hovermode: 'closest',
                    height: 500
                }}
                style={{ width: '100%' }}
                config={{ responsive: true }}
            />

            <div className="mt-4 text-sm text-gray-600">
                Showing up to 500 data points with interactive tooltips
            </div>
        </div>
    );
}

export default ScatterPlotViz;