const fs = require('fs');
const path = require('path');

const files = {
  'src/pages/Projects.tsx': `import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const Projects: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.projects;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/projects', { name, description, status: 'ACTIVE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsCreating(false);
      setName('');
      setDescription('');
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
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-surface-secondary)' }}>
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
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {data?.map((project: any) => (
          <Link to={\`/projects/\${project.id}\`} key={project.id} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>{project.name}</h3>
              <p style={{ marginBottom: '1rem', minHeight: '3rem' }}>{project.description}</p>
              <span className="badge">{project.status}</span>
            </div>
          </Link>
        ))}
        {data?.length === 0 && !isCreating && (
          <p style={{ color: 'var(--color-ink-secondary)' }}>No projects found. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};
`,
  'src/pages/ProjectDetail.tsx': `import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await apiClient.get(\`/projects/\${id}\`);
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.post('/tasks', { title, description, priority, projectId: id, status: 'TODO' });
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

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div>
      <Link to="/projects" style={{ color: 'var(--color-ink-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Projects
      </Link>
      
      <div className="page-header">
        <h1 className="page-title">{data.name}</h1>
      </div>
      
      <p style={{ fontSize: '1.125rem', color: 'var(--color-ink-secondary)', marginBottom: '2rem' }}>
        {data.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Tasks</h2>
        <button className="btn btn-outline" onClick={() => setIsCreating(!isCreating)}>
          {isCreating ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {isCreating && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-surface-secondary)' }}>
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
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.tasks?.map((task: any) => (
          <Link to={\`/tasks/\${task.id}\`} key={task.id} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={\`badge priority-\${task.priority.toLowerCase()}\`}>{task.priority}</span>
                <span style={{ fontWeight: 500, color: 'var(--color-ink-primary)' }}>{task.title}</span>
              </div>
              <span style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>{task.status}</span>
            </div>
          </Link>
        ))}
        {data.tasks?.length === 0 && !isCreating && <p style={{ color: 'var(--color-ink-secondary)' }}>No tasks in this project yet.</p>}
      </div>
    </div>
  );
};
`,
  'src/pages/Tasks.tsx': `import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const Tasks: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [projectId, setProjectId] = useState('');

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/tasks');
      return res.data.tasks;
    }
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.projects;
    }
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = { title, description, priority, status: 'TODO' };
      if (projectId) Object.assign(payload, { projectId });
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
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-surface-secondary)' }}>
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
              <select className="input-control" value={projectId} onChange={e => setProjectId(e.target.value)}>
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
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks?.map((task: any) => (
          <Link to={\`/tasks/\${task.id}\`} key={task.id} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 0 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span className={\`badge priority-\${task.priority.toLowerCase()}\`}>{task.priority}</span>
                  <span style={{ fontWeight: 500, color: 'var(--color-ink-primary)', fontSize: '1.125rem' }}>{task.title}</span>
                </div>
                <span style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>
                  Project: {task.project?.name || 'Unassigned'}
                </span>
              </div>
              <span className="badge">{task.status}</span>
            </div>
          </Link>
        ))}
        {tasks?.length === 0 && !isCreating && <p style={{ color: 'var(--color-ink-secondary)' }}>No tasks found. Get to work!</p>}
      </div>
    </div>
  );
};
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(process.cwd(), filepath), content);
}
console.log("Updated components with creation logic");
