import { useEffect, useMemo, useState } from 'react';
import { Trophy, Search, RotateCcw } from 'lucide-react';
import { loadAchievements, saveAchievements, evaluateAchievements, loadProfile, resetGamification } from '../utils/gamification';

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  levelReq?: number;
  tasksReq?: number;
};

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'pending'>('all');

  useEffect(() => {
    (async () => {
      const list = await loadAchievements();
      const profile = loadProfile();
      const evaluated = evaluateAchievements(profile, list);
      setAchievements(evaluated);
      await saveAchievements(evaluated);
    })();
  }, []);

  const filtered = useMemo(() => {
    let base = achievements;
    if (filter === 'unlocked') base = base.filter(a => a.unlocked);
    if (filter === 'pending') base = base.filter(a => !a.unlocked);
    if (query.trim()) {
      const q = query.toLowerCase();
      base = base.filter(a => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return base;
  }, [achievements, query, filter]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-2xl">
              <Trophy className="text-indigo-600 w-8 h-8" />
            </div>
            Logros
          </h1>
          <p className="text-slate-500 mt-2 ml-16">{achievements.filter(a => a.unlocked).length} desbloqueados • {achievements.length} totales</p>
        </div>
        <div>
          <button
            onClick={async () => {
              const ok = window.confirm('¿Seguro que quieres reiniciar niveles y logros? Esta acción no afectará tus tareas.');
              if (!ok) return;
              await resetGamification();
              const list = await loadAchievements();
              const profile = loadProfile();
              const evaluated = evaluateAchievements(profile, list);
              setAchievements(evaluated);
              await saveAchievements(evaluated);
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl shadow-sm"
            title="Reiniciar niveles y logros"
          >
            <RotateCcw className="w-5 h-5" />
            Reiniciar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              placeholder="Buscar logro..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${filter === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('unlocked')}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${filter === 'unlocked' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              Desbloqueados
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium border ${filter === 'pending' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 border-slate-200'}`}
            >
              Pendientes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(a => (
          <div
            key={a.id}
            className={`p-5 rounded-2xl border shadow-sm ${a.unlocked ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-white'}`}
          >
            <p className="font-semibold text-slate-800">{a.title}</p>
            <p className="text-slate-500 text-sm">{a.description}</p>
            <div className="mt-3 text-xs text-slate-500">
              {a.levelReq ? <span className="mr-2">Nivel {a.levelReq}</span> : null}
              {a.tasksReq ? <span>{a.tasksReq} tareas</span> : null}
            </div>
            <div className="mt-3">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${a.unlocked ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {a.unlocked ? 'Desbloqueado' : 'Pendiente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
