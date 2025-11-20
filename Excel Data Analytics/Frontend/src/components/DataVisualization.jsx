import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BarChartViz from './Visualizations/BarChartViz';
import LineChartViz from './Visualizations/LineChartViz';
import ScatterPlotViz from './Visualizations/ScatterPlotViz';
import HeatmapViz from './Visualizations/HeatmapViz';
import PivotTableViz from './Visualizations/PivotTableViz';
import BoxPlotViz from './Visualizations/BoxPlotViz';
import KPIDashboard from './Visualizations/KPIDashboard';
import DecompositionTree from './Visualizations/DecompositionTree';
import ChoroplethMap from './Visualizations/ChoroplethMap';
import PieChartViz from './Visualizations/PieChartViz';

function DataVisualization() {
    const { fileId } = useParams();
    const navigate = useNavigate();
    const [fileData, setFileData] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [activeViz, setActiveViz] = useState('table');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFileData();
    }, [fileId]);

    const fetchFileData = async () => {
        try {
            const response = await axios.get(`/upload/file/${fileId}`);
            setFileData(response.data);
            setParsedData(response.data.parsedData || []);

            await axios.post('/user/increment-visualization', {
                visualizationType: 'file_view'
            });
        } catch (error) {
            console.error('Error fetching file:', error);
            alert('Error loading file');
            navigate('/dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (chartType) => {
        await axios.post('/user/increment-download', { chartType });
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const columns = parsedData.length > 0 ? Object.keys(parsedData[0]) : [];

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">Data Visualization</h1>
                    <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
                        Back to Dashboard
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <h2 className="text-xl font-bold mb-2">{fileData?.originalName}</h2>
                    <p className="text-gray-600">Rows: {parsedData.length} | Columns: {columns.length}</p>
                </div>

                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="flex flex-wrap border-b overflow-x-auto">
                        {['table', 'kPI', 'bar', 'line', 'pie', 'scatter', 'heatmap', 'pivot', 'box', 'tree', 'map'].map((viz) => (
                            <button
                                key={viz}
                                onClick={() => setActiveViz(viz)}
                                className={`px-4 py-3 text-sm ${activeViz === viz ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                            >
                                {viz.charAt(0).toUpperCase() + viz.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeViz === 'table' && (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            {columns.map((col, i) => (
                                                <th key={i} className="border p-2 text-left">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parsedData.slice(0, 100).map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                {columns.map((col, j) => (
                                                    <td key={j} className="border p-2">{row[col]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeViz === 'kPI' && <KPIDashboard data={parsedData} columns={columns} />}
                        {activeViz === 'bar' && <BarChartViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'pie' && <PieChartViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'line' && <LineChartViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'scatter' && <ScatterPlotViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'heatmap' && <HeatmapViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'pivot' && <PivotTableViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'box' && <BoxPlotViz data={parsedData} columns={columns} onDownload={handleDownload} />}
                        {activeViz === 'tree' && <DecompositionTree data={parsedData} columns={columns} />}
                        {activeViz === 'map' && <ChoroplethMap data={parsedData} columns={columns} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataVisualization;