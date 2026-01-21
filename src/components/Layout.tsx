import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, DollarSign, Calendar, CheckSquare, Home, Trophy } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Inicio', href: '/', icon: LayoutDashboard },
    { name: 'Compras', href: '/shopping', icon: ShoppingCart },
    { name: 'Gastos', href: '/expenses', icon: DollarSign },
    { name: 'Eventos', href: '/events', icon: Calendar },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Logros', href: '/achievements', icon: Trophy },
  ];

  return (
    <div className="min-h-[100dvh] bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-72 bg-slate-900 text-white shadow-xl z-20">
        <div className="flex items-center px-8 h-20 border-b border-slate-800/50 bg-slate-900">
          <div className="bg-indigo-500 p-2 rounded-lg mr-3 shadow-lg shadow-indigo-500/30">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">Mi Hogar</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 translate-x-1'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center">v1.0.0 • Hecho con ❤️</p>
        </div>
      </div>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[100dvh] relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/80 to-slate-50 -z-10" />

        {/* Mobile Header */}
        <div className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 pt-safe flex items-center justify-between shrink-0 sticky top-0 z-30">
             <div className="flex items-center">
                <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
                    <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">Mi Hogar</span>
             </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-24 md:pb-10 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 shrink-0 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          {navigation.map((item) => {
             const Icon = item.icon;
             const isActive = location.pathname === item.href;
             return (
               <Link
                 key={item.name}
                 to={item.href}
                 className={`flex flex-col items-center p-2 rounded-xl transition-colors ${
                   isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                 <span className="text-[10px] font-medium mt-1">{item.name}</span>
               </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;
