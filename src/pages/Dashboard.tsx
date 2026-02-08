import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, DollarSign, Calendar, CheckSquare, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    shoppingCount: 0,
    monthExpenses: 0,
    eventsCount: 0,
    tasksCount: 0
  });

  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const shoppingItems = JSON.parse(localStorage.getItem('shopping-items') || '[]');
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthExpenses = expenses
      .filter((e: any) => e.date.startsWith(currentMonth))
      .reduce((sum: number, e: any) => sum + e.amount, 0);

    const futureEvents = events.filter((e: any) => {
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       return new Date(e.date) >= today;
    });

    const pendingTasks = tasks.filter((t: any) => !t.completed);
    const pendingShopping = shoppingItems.filter((i: any) => !i.completed);

    setStats({
      shoppingCount: pendingShopping.length,
      monthExpenses,
      eventsCount: futureEvents.length,
      tasksCount: pendingTasks.length
    });

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  const cards = [
    {
      title: 'Compras Pendientes',
      value: stats.shoppingCount,
      icon: ShoppingCart,
      link: '/shopping',
      color: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/30',
      label: 'artículos'
    },
    {
      title: 'Gastos del Mes',
      value: `$${stats.monthExpenses.toLocaleString('es-ES')}`,
      icon: DollarSign,
      link: '/expenses',
      color: 'from-emerald-500 to-teal-500',
      shadow: 'shadow-emerald-500/30',
      label: 'acumulado'
    },
    {
      title: 'Próximos Eventos',
      value: stats.eventsCount,
      icon: Calendar,
      link: '/events',
      color: 'from-violet-500 to-purple-500',
      shadow: 'shadow-violet-500/30',
      label: 'eventos'
    },
    {
      title: 'Tareas Pendientes',
      value: stats.tasksCount,
      icon: CheckSquare,
      link: '/tasks',
      color: 'from-orange-500 to-amber-500',
      shadow: 'shadow-orange-500/30',
      label: 'tareas'
    }
  ];

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-2">
          {greeting}, <span className="text-indigo-600">Familia</span>
        </h1>
        <p className="text-slate-500 text-lg">Aquí tienes el resumen de actividad de tu hogar hoy.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link 
              key={index}
              to={card.link} 
              className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 bg-gradient-to-br ${card.color} text-white shadow-xl ${card.shadow} group`}
            >
               <div className="absolute -right-6 -top-6 opacity-20 group-hover:opacity-30 transition-opacity transform rotate-12 group-hover:scale-110 duration-500">
                 <Icon className="w-32 h-32" />
               </div>
               
               <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                   <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
                     <Icon className="w-6 h-6 text-white" />
                   </div>
                   <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                 </div>
                 
                 <h3 className="text-lg font-medium text-white/90 mb-1">{card.title}</h3>
                 <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold tracking-tight">{card.value}</p>
                    {card.label && <span className="text-sm text-white/80 font-medium">{card.label}</span>}
                 </div>
               </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Accesos Rápidos</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/shopping" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100 group">
                <ShoppingCart className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span className="font-medium">Nueva Compra</span>
            </Link>
             <Link to="/expenses" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-100 group">
                <DollarSign className="w-8 h-8 mb-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                <span className="font-medium">Registrar Gasto</span>
            </Link>
             <Link to="/events" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-violet-50 hover:text-violet-600 transition-colors border border-slate-100 group">
                <Calendar className="w-8 h-8 mb-3 text-slate-400 group-hover:text-violet-600 transition-colors" />
                <span className="font-medium">Crear Evento</span>
            </Link>
             <Link to="/tasks" className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors border border-slate-100 group">
                <CheckSquare className="w-8 h-8 mb-3 text-slate-400 group-hover:text-orange-600 transition-colors" />
                <span className="font-medium">Agregar Tarea</span>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
