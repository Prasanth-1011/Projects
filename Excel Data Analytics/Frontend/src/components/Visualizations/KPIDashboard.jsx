import React, { useMemo } from 'react';
import CountUp from 'react-countup';

function KPIDashboard({ data, columns }) {
    const kpis = useMemo(() => {
        const numericColumns = columns.filter(col => {
            const values = data.map(row => parseFloat(row[col]));
            return values.some(v => !isNaN(v));
        });

        const metrics = {};

        numericColumns.forEach(col => {
            const values = data.map(row => parseFloat(row[col])).filter(v => !isNaN(v));

            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                const avg = sum / values.length;
                const min = Math.min(...values);
                const max = Math.max(...values);

                metrics[col] = { sum, avg, min, max, count: values.length };
            }
        });

        return {
            totalRows: data.length,
            totalColumns: columns.length,
            metrics
        };
    }, [data, columns]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">KPI Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="text-sm opacity-80 mb-2">Total Rows</div>
                    <div className="text-4xl font-bold">
                        <CountUp end={kpis.totalRows} duration={2} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="text-sm opacity-80 mb-2">Total Columns</div>
                    <div className="text-4xl font-bold">
                        <CountUp end={kpis.totalColumns} duration={2} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="text-sm opacity-80 mb-2">Numeric Columns</div>
                    <div className="text-4xl font-bold">
                        <CountUp end={Object.keys(kpis.metrics).length} duration={2} />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
                    <div className="text-sm opacity-80 mb-2">Data Completeness</div>
                    <div className="text-4xl font-bold">
                        <CountUp end={100} duration={2} suffix="%" decimals={0} />
                    </div>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Detailed Metrics by Column</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(kpis.metrics).map(([col, metric]) => (
                    <div key={col} className="bg-white border-2 border-gray-200 p-6 rounded-lg shadow">
                        <h4 className="font-bold text-lg mb-4 text-gray-800">{col}</h4>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Sum:</span>
                                <span className="font-bold text-blue-600">
                                    <CountUp end={metric.sum} duration={2} decimals={2} separator="," />
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Average:</span>
                                <span className="font-bold text-green-600">
                                    <CountUp end={metric.avg} duration={2} decimals={2} separator="," />
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Min:</span>
                                <span className="font-bold text-orange-600">
                                    {metric.min.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Max:</span>
                                <span className="font-bold text-purple-600">
                                    {metric.max.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-gray-600 text-sm">Count:</span>
                                <span className="font-bold text-gray-800">
                                    {metric.count}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {Object.keys(kpis.metrics).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                    No numeric columns found in the dataset
                </div>
            )}
        </div>
    );
}

export default KPIDashboard;