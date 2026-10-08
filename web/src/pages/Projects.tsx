import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Trash2, Circle } from 'lucide-react';

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pendingDelete, setPendingDelete] = useState<{id: string, name: string, timeoutId: any} | null>(null);

  const handleDelete = (id: string, projectName: string) => {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timeoutId);
      deleteMutation.mutate(pendingDelete.id);
    }
    const timeoutId = setTimeout(() => {
      deleteMutation.mutate(id);
      setPendingDelete(prev => prev?.id === id ? null : prev);
    }, 5000);
    setPendingDelete({ id, name: projectName, timeoutId });
  };

  const handleUndo = () => {
    if (pendingDelete) {
      clearTimeout(pendingDelete.timeoutId);
      setPendingDelete(null);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/projects', { name, description, status: 'NOT_STARTED' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsCreating(false);
      setName('');
      setDescription('');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (project: any) => {
      const newStatus = project.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
      return await apiClient.put(`/projects/${project.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn btn-primary" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'New Project'}
        </button>
      </div>
      
      {isCreating && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }}
          className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-surface-secondary)' }}
        >
          <h3>Create New Project</h3>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Project Name</label>
            <input className="input-control" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Project details..." rows={3} />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => createMutation.mutate()}
            disabled={!name || createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Save Project'}
          </button>
        </motion.div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {data?.filter((p: any) => p.id !== pendingDelete?.id).map((project: any) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.3 } }}
              layout
              className="card"
              style={{ 
                backgroundColor: project.status === 'COMPLETED' ? 'var(--color-surface-secondary)' : 'var(--color-surface)',
                opacity: project.status === 'COMPLETED' ? 0.7 : 1,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button 
                    onClick={(e) => { e.preventDefault(); toggleMutation.mutate(project); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    {project.status === 'COMPLETED' ? (
                      <CheckCircle2 size={24} color="var(--color-success)" />
                    ) : (
                      <Circle size={24} color="var(--color-border)" />
                    )}
                  </button>
                  <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: project.status === 'COMPLETED' ? 'var(--color-ink-secondary)' : 'var(--color-ink-primary)' }}>
                    <h3 style={{ margin: 0, textDecoration: project.status === 'COMPLETED' ? 'line-through' : 'none' }}>{project.name}</h3>
                  </Link>
                </div>
                <button 
                  onClick={(e) => { e.preventDefault(); handleDelete(project.id, project.name); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--color-danger)' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
                <p style={{ marginBottom: '1rem', minHeight: '3rem', color: 'var(--color-ink-secondary)' }}>{project.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge">{project.status}</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-ink-secondary)' }}>{project._count?.tasks || 0} tasks</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        {data?.length === 0 && !isCreating && (
          <p style={{ color: 'var(--color-ink-secondary)' }}>No projects found. Create one to get started!</p>
        )}
      </div>

      <AnimatePresence>
        {pendingDelete && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{ position: 'fixed', bottom: 24, right: 24, background: 'var(--color-ink-primary)', color: 'var(--color-surface)', padding: '12px 24px', borderRadius: 8, display: 'flex', gap: 16, alignItems: 'center', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            <span>Deleted "{pendingDelete.name}"</span>
            <button onClick={handleUndo} style={{ background: 'var(--color-surface)', color: 'var(--color-ink-primary)', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer', fontWeight: 600 }}>Undo</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
