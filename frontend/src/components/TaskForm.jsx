import React, { useState, useEffect } from 'react';

export default function TaskForm({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);
  useEffect(()=> { setTitle(initial?.title || ''); setDescription(initial?.description || ''); }, [initial]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ title, description, completed: initial?.completed ?? false });
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  return (
    <div className="modal">
      <form onSubmit={submit} className="card modal-content">
        <h3>{initial ? 'Edit Task' : 'Add Task'}</h3>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required/>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" />
        <div className="actions">
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
