import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Circle } from 'lucide-react';

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [project_id, setProjectId] = useState('');

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/tasks');
      return res.data.data;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { name: title, description, priority, status: 'PENDING' };
      if (project_id) Object.assign(payload, { project_id });
      return await apiClient.post('/tasks', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setProjectId('');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (task: any) => {
      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      return await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  if (tasksLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <button className="btn btn-primary" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-surface-secondary)' }}
        >
          <h3>Create New Task</h3>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Task Title</label>
            <input className="input-control" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Design homepage" />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input-control" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Priority</label>
              <select className="input-control" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="input-group">
              <label>Project (Optional)</label>
              <select className="input-control" value={project_id} onChange={e => setProjectId(e.target.value)}>
                <option value="">-- No Project --</option>
                {projects?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => createMutation.mutate()}
            disabled={!title || createMutation.isPending}
          >
            {createMutation.isPending ? 'Saving...' : 'Save Task'}
          </button>
        </motion.div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {tasks?.map((task: any) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.3 } }}
              layout
              className="card"
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 0,
                backgroundColor: task.status === 'COMPLETED' ? 'var(--color-surface-secondary)' : 'var(--color-surface)',
                opacity: task.status === 'COMPLETED' ? 0.7 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <button 
                  onClick={(e) => { e.preventDefault(); toggleMutation.mutate(task); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex' }}
                >
                  {task.status === 'COMPLETED' ? (
                    <Check size={24} color="var(--color-success)" />
                  ) : (
                    <Circle size={24} color="var(--color-border)" />
                  )}
                </button>
                <Link to={`/tasks/${task.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      <span style={{ 
                        fontWeight: 500, 
                        color: task.status === 'COMPLETED' ? 'var(--color-ink-secondary)' : 'var(--color-ink-primary)', 
                        fontSize: '1.125rem',
                        textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
                      }}>
                        {task.name}
                      </span>
                    </div>
                    <span style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>
                      Project: {task.project?.name || 'Unassigned'}
                    </span>
                  </div>
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="badge">{task.status}</span>
                <button 
                  onClick={(e) => { e.preventDefault(); deleteMutation.mutate(task.id); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks?.length === 0 && !isCreating && <p style={{ color: 'var(--color-ink-secondary)' }}>No tasks found. Get to work!</p>}
      </div>
    </div>
  );
};
