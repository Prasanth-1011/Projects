import React, { useMemo, useState } from 'react';
import Tree from 'react-d3-tree';
import Select from 'react-select';

function DecompositionTree({ data, columns }) {
    const [hierarchyFields, setHierarchyFields] = useState([columns[0], columns[1]].filter(Boolean));
    const [valueField, setValueField] = useState(columns[2] || columns[0]);

    const columnOptions = columns.map(col => ({ value: col, label: col }));

    const treeData = useMemo(() => {
        if (hierarchyFields.length === 0) return null;

        const buildTree = (items, level = 0) => {
            if (level >= hierarchyFields.length) return [];

            const field = hierarchyFields[level];
            const grouped = {};

            items.forEach(item => {
                const key = String(item[field]);
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push(item);
            });

            return Object.entries(grouped).map(([key, group]) => {
                const values = group.map(g => parseFloat(g[valueField])).filter(v => !isNaN(v));
                const total = values.reduce((a, b) => a + b, 0);

                return {
                    name: `${key} (${total.toFixed(2)})`,
                    attributes: {
                        count: group.length,
                        total: total.toFixed(2)
                    },
                    children: level < hierarchyFields.length - 1 ? buildTree(group, level + 1) : []
                };
            }).slice(0, 10);
        };

        return {
            name: 'Root',
            attributes: {
                total: data.length
            },
            children: buildTree(data)
        };
    }, [data, hierarchyFields, valueField]);

    return (
        <div>
            <div className="mb-6">
                <h3 className="font-bold mb-2">Configure Hierarchy</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Select 1-3 columns to create a hierarchical breakdown
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Hierarchy Levels (in order)</label>
                        <Select
                            isMulti
                            value={hierarchyFields.map(f => ({ value: f, label: f }))}
                            onChange={(opts) => setHierarchyFields(opts.map(o => o.value))}
                            options={columnOptions}
                            placeholder="Select hierarchy fields..."
                        />
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
            </div>

            {treeData && hierarchyFields.length > 0 ? (
                <div className="bg-white border rounded-lg" style={{ width: '100%', height: '600px' }}>
                    <Tree
                        data={treeData}
                        orientation="vertical"
                        translate={{ x: 400, y: 50 }}
                        pathFunc="step"
                        nodeSize={{ x: 200, y: 150 }}
                        separation={{ siblings: 1.5, nonSiblings: 2 }}
                        renderCustomNodeElement={({ nodeDatum }) => (
                            <g>
                                <circle r="15" fill="#3b82f6" />
                                <text fill="black" strokeWidth="0" x="25" fontSize="12">
                                    {nodeDatum.name}
                                </text>
                                {nodeDatum.attributes?.count && (
                                    <text fill="gray" x="25" y="15" fontSize="10">
                                        Count: {nodeDatum.attributes.count}
                                    </text>
                                )}
                            </g>
                        )}
                    />
                </div>
            ) : (
                <div className="text-center text-gray-500 py-12 bg-gray-50 rounded">
                    Please select at least one hierarchy field to display the tree
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                Decomposition tree shows hierarchical breakdown of data (limited to 10 nodes per level)
            </div>
        </div>
    );
}

export default DecompositionTree;