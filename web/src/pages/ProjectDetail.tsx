import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Trash2, Circle, Edit3, X, Save } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDescription, setEditProjectDescription] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${id}`);
      return res.data.data;
    }
  });

  React.useEffect(() => {
    if (data && !isEditingProject) {
      setEditProjectName(data.name);
      setEditProjectDescription(data.description || '');
    }
  }, [data, isEditingProject]);

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/tasks', { name: title, description, priority, project_id: id, status: 'PENDING' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsCreating(false);
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async (task: any) => {
      const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      return await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (taskId: string) => {
      return await apiClient.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.delete(`/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/projects');
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.put(`/projects/${id}`, {
        name: editProjectName,
        description: editProjectDescription
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsEditingProject(false);
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div>
      <Link to="/projects" style={{ color: 'var(--color-ink-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Projects
      </Link>
      
      {isEditingProject ? (
        <div className="card" style={{ backgroundColor: 'var(--color-surface-secondary)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Edit Project</h3>
            <button className="btn btn-outline" onClick={() => setIsEditingProject(false)} style={{ padding: '0.25rem 0.5rem' }}>
              <X size={16} /> Cancel
            </button>
          </div>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Project Name</label>
            <input className="input-control" value={editProjectName} onChange={e => setEditProjectName(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input-control" value={editProjectDescription} onChange={e => setEditProjectDescription(e.target.value)} rows={3} />
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => updateProjectMutation.mutate()}
            disabled={!editProjectName || updateProjectMutation.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> {updateProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 className="page-title">{data.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsEditingProject(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={16} /> Edit
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  if(window.confirm('Are you sure you want to delete this project and all its tasks?')) {
                    deleteProjectMutation.mutate();
                  }
                }}
                style={{ borderColor: 'var(--color-danger)', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
          
          <p style={{ fontSize: '1.125rem', color: 'var(--color-ink-secondary)', marginBottom: '2rem' }}>
            {data.description}
          </p>
        </>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Tasks</h2>
        <button className="btn btn-outline" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'Add Task'}
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
          <div className="input-group">
            <label>Priority</label>
            <select className="input-control" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
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
          {data.tasks?.map((task: any) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                    <span style={{ 
                      fontWeight: 500, 
                      color: task.status === 'COMPLETED' ? 'var(--color-ink-secondary)' : 'var(--color-ink-primary)',
                      textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none'
                    }}>
                      {task.name}
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
        {data.tasks?.length === 0 && !isCreating && <p style={{ color: 'var(--color-ink-secondary)' }}>No tasks in this project yet.</p>}
      </div>
    </div>
  );
};
