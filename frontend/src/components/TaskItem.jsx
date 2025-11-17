import React from 'react';

export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  return (
    <div className={`task-item ${task.completed ? 'done' : ''}`}>
      <div>
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <small>{task.createdAt}</small>
      </div>
      <div className="controls">
        <button onClick={onToggle}>{task.completed ? 'Mark Pending' : 'Complete'}</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
