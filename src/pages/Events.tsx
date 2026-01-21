import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { saveCollection } from '../utils/idb';

interface Event {
  id: string;
  name: string;
  date: string;
  location?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('events') || '[]');
    } catch {
      return [];
    }
  });
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    location: ''
  });

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
    (async () => {
      try {
        await saveCollection('events', events);
      } catch {
        // ignore
      }
    })();
  }, [events]);

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name || !newEvent.date) return;

    const event: Event = {
      id: crypto.randomUUID(),
      name: newEvent.name,
      date: newEvent.date,
      location: newEvent.location
    };

    setEvents([...events, event]);
    setNewEvent({ name: '', date: '', location: '' });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const getDaysRemaining = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <div className="p-3 bg-violet-100 rounded-2xl">
                <CalendarIcon className="text-violet-600 w-8 h-8" />
             </div>
             Próximos Eventos
           </h1>
           <p className="text-slate-500 mt-2 ml-16">No te pierdas ninguna fecha importante.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Form */}
         <div className="lg:col-span-1">
             <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 p-6 border border-slate-100 sticky top-24">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <div className="bg-violet-100 p-2 rounded-lg"><Plus className="w-5 h-5 text-violet-600"/></div>
                    Nuevo Evento
                </h3>
                <form onSubmit={addEvent} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Nombre del evento</label>
                        <input
                        type="text"
                        value={newEvent.name}
                        onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="Ej: Cumpleaños mamá"
                        required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Fecha</label>
                        <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all text-sm"
                        required
                        />
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación (opcional)</label>
                        <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                        placeholder="Ej: Casa, Restaurante..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-violet-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                    >
                        Guardar Evento
                    </button>
                </form>
             </div>
         </div>

         {/* List */}
         <div className="lg:col-span-2 space-y-4">
             {sortedEvents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                     <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarIcon className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-xl font-medium text-slate-600 mb-2">No hay eventos próximos</p>
                    <p className="text-slate-400">Agrega cumpleaños, reuniones o fechas especiales.</p>
                </div>
             ) : (
                sortedEvents.map((event) => {
                  const days = getDaysRemaining(event.date);
                  const isPast = days < 0;
                  const isToday = days === 0;

                  return (
                    <div 
                        key={event.id} 
                        className={`group relative bg-white p-6 rounded-3xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                            isPast ? 'border-slate-100 opacity-60' : 
                            isToday ? 'border-violet-200 ring-1 ring-violet-200 bg-violet-50/30' : 
                            'border-slate-100 hover:border-violet-100'
                        }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`
                                w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold border
                                ${isPast ? 'bg-slate-100 text-slate-400 border-slate-200' : 
                                  isToday ? 'bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/30' : 
                                  'bg-white text-slate-700 border-slate-200'
                                }
                            `}>
                                <span className="text-xs uppercase tracking-wider opacity-80">
                                    {new Date(event.date).toLocaleDateString('es-ES', { month: 'short' }).slice(0, 3)}
                                </span>
                                <span className="text-2xl">
                                    {new Date(event.date).getDate()}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className={`text-xl font-bold ${isPast ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                    {event.name}
                                </h3>
                                <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-center text-sm text-slate-500">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        <span>
                                            {isPast ? `Pasó hace ${Math.abs(days)} días` : 
                                             isToday ? '¡Es hoy!' : 
                                             `Faltan ${days} días`}
                                        </span>
                                    </div>
                                    {event.location && (
                                        <div className="flex items-center text-sm text-slate-500">
                                            <MapPin className="w-4 h-4 mr-1.5" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => deleteEvent(event.id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 sm:static sm:opacity-0 sm:group-hover:opacity-100"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
             )}
         </div>
      </div>
    </div>
  );
};

export default Events;
