import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';
import axios from 'axios';

function BoxPlotViz({ data, columns, onDownload }) {
    const [selectedColumn, setSelectedColumn] = useState(columns[0]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(false);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const plotData = useMemo(() => {
        const values = data.map(row => parseFloat(row[selectedColumn])).filter(v => !isNaN(v));

        return [{
            y: values,
            type: 'box',
            name: selectedColumn,
            marker: { color: 'rgb(59, 130, 246)' },
            boxmean: 'sd'
        }];
    }, [data, selectedColumn]);

    const fetchStatistics = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/visualizations/statistics', {
                data,
                column: selectedColumn
            });
            setStatistics(response.data);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Select Column (Numeric)</label>
                    <Select
                        value={{ value: selectedColumn, label: selectedColumn }}
                        onChange={(opt) => {
                            setSelectedColumn(opt.value);
                            setStatistics(null);
                        }}
                        options={columnOptions}
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={fetchStatistics}
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {loading ? 'Computing...' : 'Compute Statistics'}
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <button
                    onClick={() => onDownload('box_plot')}
                    className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                >
                    Download Chart
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Plot
                        data={plotData}
                        layout={{
                            title: `Box Plot: ${selectedColumn}`,
                            yaxis: { title: 'Value' },
                            height: 400
                        }}
                        style={{ width: '100%' }}
                        config={{ responsive: true }}
                    />
                </div>

                <div>
                    {statistics && (
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg mb-4">Statistical Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold">Mean:</span>
                                    <span>{statistics.mean.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Median:</span>
                                    <span>{statistics.median.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Min:</span>
                                    <span>{statistics.min.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Max:</span>
                                    <span>{statistics.max.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Std Dev:</span>
                                    <span>{statistics.standardDeviation.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-semibold">Variance:</span>
                                    <span>{statistics.variance.toFixed(2)}</span>
                                </div>
                                <div className="mt-4">
                                    <span className="font-semibold">Quartiles:</span>
                                    <div className="ml-4 mt-1">
                                        <div>Q1 (25%): {statistics.quantiles[0].toFixed(2)}</div>
                                        <div>Q2 (50%): {statistics.quantiles[1].toFixed(2)}</div>
                                        <div>Q3 (75%): {statistics.quantiles[2].toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
                Box plot shows distribution with quartiles, median, and outliers
            </div>
        </div>
    );
}

export default BoxPlotViz;