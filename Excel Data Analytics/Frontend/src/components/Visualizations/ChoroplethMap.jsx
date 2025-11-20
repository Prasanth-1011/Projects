import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import Select from 'react-select';

function ChoroplethMap({ data, columns }) {
    const [locationField, setLocationField] = useState(columns[0]);
    const [valueField, setValueField] = useState(columns[1] || columns[0]);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const mapData = useMemo(() => {
        const aggregated = {};

        data.forEach(row => {
            const location = String(row[locationField]).trim();
            const value = parseFloat(row[valueField]);

            if (!isNaN(value)) {
                aggregated[location] = (aggregated[location] || 0) + value;
            }
        });

        const locations = Object.keys(aggregated);
        const values = Object.values(aggregated);

        return { locations, values };
    }, [data, locationField, valueField]);

    return (
        <div>
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Location Field</label>
                    <Select
                        value={{ value: locationField, label: locationField }}
                        onChange={(opt) => setLocationField(opt.value)}
                        options={columnOptions}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Should contain state names, abbreviations, or country codes
                    </p>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Value Field (Numeric)</label>
                    <Select
                        value={{ value: valueField, label: valueField }}
                        onChange={(opt) => setValueField(opt.value)}
                        options={columnOptions}
                    />
                </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
                <Plot
                    data={[{
                        type: 'choropleth',
                        locationmode: 'USA-states',
                        locations: mapData.locations,
                        z: mapData.values,
                        text: mapData.locations,
                        colorscale: [
                            [0, 'rgb(242, 240, 247)'],
                            [0.2, 'rgb(218, 218, 235)'],
                            [0.4, 'rgb(188, 189, 220)'],
                            [0.6, 'rgb(158, 154, 200)'],
                            [0.8, 'rgb(117, 107, 177)'],
                            [1, 'rgb(84, 39, 143)']
                        ],
                        colorbar: {
                            title: valueField,
                            thickness: 15,
                            len: 0.7
                        },
                        marker: {
                            line: {
                                color: 'rgb(255,255,255)',
                                width: 2
                            }
                        }
                    }]}
                    layout={{
                        title: `${valueField} by ${locationField}`,
                        geo: {
                            scope: 'usa',
                            projection: {
                                type: 'albers usa'
                            },
                            showlakes: true,
                            lakecolor: 'rgb(255, 255, 255)'
                        },
                        height: 500
                    }}
                    style={{ width: '100%' }}
                    config={{ responsive: true }}
                />
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
                Choropleth map showing geographic distribution. Hover over regions for details.
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
                <h4 className="font-bold mb-2 text-sm">Map Tips:</h4>
                <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Location field should contain US state names or 2-letter codes (e.g., "CA", "California")</li>
                    <li>• For international data, use country codes (e.g., "USA", "CAN")</li>
                    <li>• Values are aggregated if multiple rows have the same location</li>
                    <li>• Zoom and pan using mouse controls</li>
                </ul>
            </div>
        </div>
    );
}

export default ChoroplethMap;