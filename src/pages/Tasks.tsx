import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckSquare, CheckCircle2, Circle } from 'lucide-react';
import { saveCollection } from '../utils/idb';
import { loadProfile, saveProfile, loadAchievements, saveAchievements, applyTaskToggle, evaluateAchievements, nextLevelRequirement } from '../utils/gamification';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks') || '[]');
    } catch {
      return [];
    }
  });
  const [newTask, setNewTask] = useState<{ title: string; priority: 'low' | 'medium' | 'high' }>({
    title: '',
    priority: 'medium'
  });
  const [profile, setProfile] = useState(loadProfile());
  const [achievements, setAchievements] = useState<Array<{
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    levelReq?: number;
    tasksReq?: number;
  }>>([]);

  useEffect(() => {
    (async () => {
      const a = await loadAchievements();
      const p = loadProfile();
      setAchievements(evaluateAchievements(p, a));
    })();
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    (async () => {
      try {
        await saveCollection('tasks', tasks);
      } catch {
        // ignore
      }
    })();
  }, [tasks]);

  useEffect(() => {
    (async () => {
      await saveProfile(profile);
      const a = await loadAchievements();
      const updated = evaluateAchievements(profile, a);
      setAchievements(updated);
      await saveAchievements(updated);
    })();
  }, [profile]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.title,
      completed: false,
      priority: newTask.priority
    };

    setTasks([task, ...tasks]);
    setNewTask({ title: '', priority: 'medium' });
  };

  const toggleTask = (id: string) => {
    const next = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    const before = tasks.find(t => t.id === id);
    const after = next.find(t => t.id === id);
    if (before && after) {
      const updated = applyTaskToggle(profile, before.completed, after.completed, after.priority);
      setProfile(updated);
    }
    setTasks(next);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 border-blue-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  const priorityLabels = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
             <div className="p-3 bg-orange-100 rounded-2xl">
                <CheckSquare className="text-orange-600 w-8 h-8" />
             </div>
             Tareas del Hogar
           </h1>
           <p className="text-slate-500 mt-2 ml-16">Organiza las responsabilidades diarias.</p>
        </div>
        <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
                {tasks.filter(t => !t.completed).length} pendientes
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">Nivel</p>
          <p className="text-3xl font-bold text-slate-800">{profile.level}</p>
        </div>
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-sm text-slate-500 mb-2">Experiencia</p>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min(100, Math.round((profile.xp / nextLevelRequirement(profile.level)) * 100))}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {profile.xp} / {nextLevelRequirement(profile.level)} XP
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
        <div className="p-6 bg-gradient-to-r from-orange-50/50 to-white border-b border-slate-100">
            <form onSubmit={addTask} className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="flex-1 px-6 py-4 rounded-xl border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 text-lg placeholder:text-slate-400 transition-all"
                    placeholder="Nueva tarea..."
                />
                <div className="flex gap-2">
                    <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                        className="px-6 py-4 rounded-xl border-0 bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 font-medium text-slate-600 cursor-pointer"
                    >
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                    <button
                        type="submit"
                        disabled={!newTask.title.trim()}
                        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden md:inline">Agregar</span>
                    </button>
                </div>
            </form>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckSquare className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl font-medium text-slate-600 mb-2">¡Todo listo!</p>
            <p className="text-slate-400">No hay tareas pendientes por ahora.</p>
            </div>
        ) : (
            tasks.sort((a, b) => {
                if (a.completed === b.completed) return 0;
                return a.completed ? 1 : -1;
            }).map((task) => (
                <div
                    key={task.id}
                    className={`group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                        task.completed 
                        ? 'bg-slate-50 border-slate-100 opacity-75' 
                        : 'bg-white border-slate-100 hover:border-orange-200 hover:shadow-md hover:shadow-orange-500/5'
                    }`}
                >
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                        <div className={`transition-colors duration-300 ${task.completed ? 'text-green-500' : 'text-slate-300 group-hover:text-orange-400'}`}>
                            {task.completed ? <CheckCircle2 className="w-7 h-7" /> : <Circle className="w-7 h-7" />}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <span className={`text-lg font-medium transition-all ${
                                task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                            }`}>
                                {task.title}
                            </span>
                            <div className="flex">
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
                                    {priorityLabels[task.priority]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => deleteTask(task.id)}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))
        )}
      </div>

      <div className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">Logros</h3>
          <span className="text-xs font-medium bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
            {achievements.filter(a => a.unlocked).length} / {achievements.length}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {achievements.slice(0, 16).map(a => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border text-sm ${a.unlocked ? 'border-orange-200 bg-orange-50' : 'border-slate-100 bg-white opacity-70'}`}
            >
              <p className="font-semibold text-slate-800">{a.title}</p>
              <p className="text-slate-500">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
