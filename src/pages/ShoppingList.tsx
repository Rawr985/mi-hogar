import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, Check } from 'lucide-react';
import { saveCollection } from '../utils/idb';

interface ShoppingItem {
  id: string;
  name: string;
  completed: boolean;
}

const ShoppingList = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('shopping-items') || '[]');
    } catch {
      return [];
    }
  });
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    localStorage.setItem('shopping-items', JSON.stringify(items));
    (async () => {
      try {
        await saveCollection('shopping-items', items);
      } catch {
        // ignore
      }
    })();
  }, [items]);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const item: ShoppingItem = {
      id: crypto.randomUUID(),
      name: newItem,
      completed: false,
    };
    setItems([item, ...items]);
    setNewItem('');
  };

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <div className="p-3 bg-indigo-100 rounded-2xl">
                <ShoppingCart className="text-indigo-600 w-8 h-8" />
             </div>
             Lista de Compras
           </h1>
           <p className="text-slate-500 mt-2 ml-16">Gestiona lo que hace falta en casa.</p>
        </div>
        <div className="hidden md:block bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
            {items.filter(i => !i.completed).length} pendientes
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 overflow-hidden border border-slate-100">
        <div className="p-6 md:p-8 bg-gradient-to-r from-indigo-50/50 to-white border-b border-slate-100">
          <form onSubmit={addItem} className="flex gap-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="¿Qué necesitas comprar?"
              className="flex-1 px-6 py-4 rounded-xl border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-lg placeholder:text-slate-400 transition-all"
            />
            <button
              type="submit"
              disabled={!newItem.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Agregar</span>
            </button>
          </form>
        </div>

        <div className="divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShoppingCart className="w-10 h-10 text-slate-300" />
              </div>
              <p className="text-xl font-medium text-slate-600 mb-2">Tu lista está vacía</p>
              <p className="text-slate-400">Agrega elementos para no olvidar nada en el súper.</p>
            </div>
          ) : (
            <ul className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center justify-between p-6 transition-all duration-300 hover:bg-slate-50 group ${
                    item.completed ? 'bg-slate-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-5 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                    <div className={`
                        w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0
                        ${item.completed 
                            ? 'bg-green-500 border-green-500 scale-110' 
                            : 'border-slate-300 group-hover:border-indigo-400 bg-white'
                        }
                    `}>
                        {item.completed && <Check className="w-5 h-5 text-white" />}
                    </div>
                    <span className={`text-lg transition-all duration-300 ${
                        item.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'
                    }`}>
                      {item.name}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {items.length > 0 && (
            <div className="bg-slate-50 p-4 text-center text-xs text-slate-400 border-t border-slate-100">
                {items.filter(i => i.completed).length} completados • {items.length} total
            </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;
