import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Package, MessageSquare, Users, FileText, CalendarDays, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppRoute } from '../types';

export default function AdminLayout() {
    const { logout } = useAuth();

    const links = [
        { label: 'Dashboard', path: AppRoute.DASHBOARD, icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Catálogo', path: AppRoute.PRODUCTS, icon: <Package className="w-5 h-5" /> },
        { label: 'Feedbacks', path: AppRoute.FEEDBACKS, icon: <MessageSquare className="w-5 h-5" /> },
        { label: 'Funcionários', path: AppRoute.FUNCIONARIOS, icon: <Users className="w-5 h-5" /> },
        { label: 'Currículos', path: AppRoute.CURRICULOS, icon: <FileText className="w-5 h-5" /> },
        { label: 'Escala', path: AppRoute.ESCALA, icon: <CalendarDays className="w-5 h-5" /> },
        { label: 'Ficha Técnica', path: AppRoute.FICHA_TECNICA, icon: <ClipboardList className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex pb-20 md:pb-0 font-sans">
            {/* Sidebar Desktop */}
            <aside className="w-64 bg-[#5A1788] text-white flex-col hidden md:flex shrink-0">
                <div className="p-6 border-b border-white/10 shrink-0">
                    <h2 className="text-2xl font-bold">Painel Manager</h2>
                    <p className="text-sm text-white/60">Área Administrativa</p>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === AppRoute.DASHBOARD}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-white/20 font-bold' : 'hover:bg-white/10'
                                }`
                            }
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10 shrink-0">
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg transition-colors">
                        <LogOut className="w-4 h-4" /> Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-[#0B0F19] p-4 md:p-8">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manager</h2>
                    <button onClick={logout} className="p-2 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg"><LogOut className="w-5 h-5" /></button>
                </div>

                {/* Navigation Dropdown Mobile */}
                <div className="md:hidden mb-6 overflow-x-auto pb-2 flex gap-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.path === AppRoute.DASHBOARD}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${isActive ? 'bg-[#5A1788] text-white border-[#5A1788]' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                                }`
                            }
                        >
                            {link.icon}
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                {/* Page Content injected here via Outlet */}
                <Outlet />
            </main>
        </div>
    );
}
