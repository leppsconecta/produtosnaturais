import React from 'react';
import { Search } from 'lucide-react';

export interface Column {
    header: string;
    accessor: string | ((row: any, i: number) => React.ReactNode);
    className?: string;
}

interface TableProps {
    columns: Column[];
    data: any[];
    searchPlaceholder?: string;
}

export default function Table({ columns, data, searchPlaceholder }: TableProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                        placeholder={searchPlaceholder || "Buscar..."}
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-bold">
                            {columns.map((col, i) => (
                                <th key={i} className={`p-4 ${col.className || ''}`}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                {columns.map((col, j) => (
                                    <td key={j} className={`p-4 ${col.className || ''}`}>
                                        {typeof col.accessor === 'function' ? col.accessor(row, i) : row[col.accessor]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {data.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} className="p-8 text-center text-slate-500 font-medium">Nenhum registro encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
