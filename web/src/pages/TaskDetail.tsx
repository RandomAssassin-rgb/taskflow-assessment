import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';
import { Check, Trash2, Edit3, X, Save } from 'lucide-react';

export const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${id}`);
      return res.data.data;
    }
  });

  useEffect(() => {
    if (data && !isEditing) {
      setEditTitle(data.name);
      setEditDescription(data.description || '');
      setEditPriority(data.priority);
    }
  }, [data, isEditing]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.put(`/tasks/${id}`, { 
        name: editTitle, 
        description: editDescription, 
        priority: editPriority 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsEditing(false);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async () => {
      const newStatus = data.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      return await apiClient.put(`/tasks/${id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/tasks');
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div>
      <Link to="/tasks" style={{ color: 'var(--color-ink-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Tasks
      </Link>
      
      {isEditing ? (
        <div className="card" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Edit Task</h3>
            <button className="btn btn-outline" onClick={() => setIsEditing(false)} style={{ padding: '0.25rem 0.5rem' }}>
              <X size={16} /> Cancel
            </button>
          </div>
          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label>Task Title</label>
            <input className="input-control" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input-control" value={editDescription} onChange={e => setEditDescription(e.target.value)} rows={3} />
          </div>
          <div className="input-group">
            <label>Priority</label>
            <select className="input-control" value={editPriority} onChange={e => setEditPriority(e.target.value)}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => updateMutation.mutate()}
            disabled={!editTitle || updateMutation.isPending}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ) : (
        <>
          <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => toggleMutation.mutate()}
                style={{ 
                  background: data.status === 'COMPLETED' ? 'var(--color-success)' : 'transparent', 
                  border: `2px solid ${data.status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-border)'}`, 
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer', 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {data.status === 'COMPLETED' && <Check size={20} color="white" />}
              </button>
              <div>
                <h1 className="page-title" style={{ margin: 0, textDecoration: data.status === 'COMPLETED' ? 'line-through' : 'none' }}>
                  {data.name}
                </h1>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="badge">{data.status}</span>
                  <span className={`badge priority-${data.priority.toLowerCase()}`}>{data.priority}</span>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={() => setIsEditing(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={16} /> Edit
              </button>
              <button 
                className="btn btn-outline" 
                onClick={() => {
                  if(window.confirm('Are you sure you want to delete this task?')) {
                    deleteMutation.mutate();
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
          
          <div className="card">
            <h3>Description</h3>
            <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', color: data.description ? 'var(--color-ink-primary)' : 'var(--color-ink-secondary)' }}>
              {data.description || 'No description provided.'}
            </p>
          </div>

          <div className="card">
            <h3>Project</h3>
            <p style={{ marginTop: '0.5rem' }}>
              {data.project ? (
                 <Link to={`/projects/${data.project_id}`} style={{ color: 'var(--color-accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                   {data.project.name}
                 </Link>
              ) : <span style={{ color: 'var(--color-ink-secondary)' }}>Unassigned</span>}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
