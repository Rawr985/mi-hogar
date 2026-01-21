import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, TrendingUp, Calendar as CalendarIcon, Tag } from 'lucide-react';
import { saveCollection } from '../utils/idb';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('expenses') || '[]');
    } catch {
      return [];
    }
  });
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    category: 'General'
  });

  const categories = ['Comida', 'Transporte', 'Servicios', 'Hogar', 'Entretenimiento', 'Salud', 'Otros'];

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    (async () => {
      try {
        await saveCollection('expenses', expenses);
      } catch {
        // ignore
      }
    })();
  }, [expenses]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      category: newExpense.category
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: '',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
      category: 'General'
    });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = expenses
    .filter(e => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <div className="p-3 bg-emerald-100 rounded-2xl">
                <DollarSign className="text-emerald-600 w-8 h-8" />
             </div>
             Control de Gastos
           </h1>
           <p className="text-slate-500 mt-2 ml-16">Administra el presupuesto de tu hogar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                  <DollarSign className="w-40 h-40" />
              </div>
              <div className="relative z-10">
                  <p className="text-emerald-100 font-medium mb-1 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" /> Este Mes
                  </p>
                  <p className="text-4xl font-bold tracking-tight">${monthExpenses.toLocaleString('es-ES')}</p>
              </div>
          </div>
          
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group hover:border-emerald-200 transition-colors">
              <div className="absolute right-0 top-0 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="w-40 h-40 text-slate-800" />
              </div>
              <div className="relative z-10">
                  <p className="text-slate-500 font-medium mb-1 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Total Acumulado
                  </p>
                  <p className="text-4xl font-bold text-slate-800 tracking-tight">${totalExpenses.toLocaleString('es-ES')}</p>
              </div>
          </div>
          
           <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col justify-center items-center text-center">
              <p className="text-emerald-800 font-medium mb-2">Registros Totales</p>
              <p className="text-5xl font-bold text-emerald-600">{expenses.length}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="bg-emerald-100 p-2 rounded-lg"><Plus className="w-5 h-5 text-emerald-600"/></div>
                    Nuevo Gasto
                </h3>
                <form onSubmit={addExpense} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Descripción</label>
                        <input
                        type="text"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Ej: Compra supermercado"
                        required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Monto</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold">$</span>
                            </div>
                            <input
                            type="number"
                            value={newExpense.amount}
                            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                            className="w-full pl-8 pr-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono font-medium"
                            placeholder="0.00"
                            step="0.01"
                            required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                            <input
                            type="date"
                            value={newExpense.date}
                            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Categoría</label>
                            <select
                            value={newExpense.category}
                            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm appearance-none"
                            >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                    >
                        Registrar Gasto
                    </button>
                </form>
            </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 text-lg">Historial de Gastos</h3>
                    <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Últimos movimientos</span>
                </div>
                
                {expenses.length === 0 ? (
                    <div className="text-center py-20">
                         <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <DollarSign className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-slate-500">No hay gastos registrados aún.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                            <div key={expense.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl shrink-0">
                                        $
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{expense.description}</p>
                                        <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3"/> {expense.date}</span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {expense.category}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-slate-800 text-lg">-${expense.amount.toLocaleString('es-ES')}</span>
                                    <button
                                        onClick={() => deleteExpense(expense.id)}
                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
