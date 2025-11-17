import React, { useEffect, useState } from 'react';
import { tasks } from '../api';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

export default function TaskListPage({ onLogout }) {
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const data = await tasks.list();
      setTaskList(data.tasks || []);
    } catch (err) {
      setError(err.data?.error || 'Failed to load');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(task) {
    await tasks.create(task);
    setShowForm(false);
    load();
  }
  async function handleUpdate(id, updates) {
    await tasks.update(id, updates);
    setEditing(null);
    load();
  }
  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return;
    await tasks.delete(id);
    load();
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Tasks</h1>
        <div>
          <button onClick={() => setShowForm(true)}>Add Task</button>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      {loading ? <p>Loading...</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="task-list">
        {taskList.length === 0 && <p>No tasks yet</p>}
        {taskList.map(t => <TaskItem key={t.id} task={t} onEdit={()=>{setEditing(t); setShowForm(true)}} onToggle={async () => { await handleUpdate(t.id, { completed: !t.completed }); }} onDelete={()=> handleDelete(t.id)} />)}
      </div>

      {showForm && <TaskForm initial={editing} onCancel={()=>{setShowForm(false); setEditing(null);}} onSave={async (payload)=> {
        if (editing) await handleUpdate(editing.id, payload); else await handleCreate(payload);
      }} />}
    </div>
  );
}
