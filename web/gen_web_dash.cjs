const fs = require('fs');
const path = require('path');

const files = {
  'src/components/layout/Sidebar.tsx': `import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Folder, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Layout.css';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>TaskFlow</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Folder size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CheckSquare size={20} />
          <span>My Tasks</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
`,
  'src/components/layout/Layout.css': `
.layout-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-ink-primary);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-ink-secondary);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 0.25rem;
  font-weight: 500;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link:hover {
  background-color: var(--color-surface-secondary);
  color: var(--color-ink-primary);
}

.nav-link.active {
  background-color: var(--color-surface-secondary);
  color: var(--color-accent-primary);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
}

.main-content {
  flex: 1;
  background-color: var(--color-bg);
  padding: 2rem 3rem;
  overflow-y: auto;
}

/* Page Common */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.card h3 {
  margin-bottom: 0.5rem;
  color: var(--color-ink-primary);
}

.card p {
  color: var(--color-ink-secondary);
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: var(--color-surface-secondary);
}

.badge.priority-high { background-color: #FDE8E1; color: var(--color-accent-danger); }
.badge.priority-medium { background-color: #FDF5E6; color: #CC982F; }
.badge.priority-low { background-color: #E8F5E9; color: #3C9B78; }
`,
  'src/components/layout/AppLayout.tsx': `import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
`,
  'src/pages/Dashboard.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard');
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-ink-primary)' }}>
            {data?.activeProjects}
          </div>
          <p>Active Projects</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-ink-primary)' }}>
            {data?.tasksDueSoon}
          </div>
          <p>Tasks Due Soon</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-ink-primary)' }}>
            {data?.completedTasksToday}
          </div>
          <p>Completed Today</p>
        </div>
      </div>
    </div>
  );
};
`,
  'src/pages/Projects.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const Projects: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.projects;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn btn-primary">New Project</button>
      </div>
      
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
      </div>
    </div>
  );
};
`,
  'src/pages/ProjectDetail.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const res = await apiClient.get(\`/projects/\${id}\`);
      return res.data;
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
        <button className="btn btn-outline">Add Task</button>
      </div>

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
        {data.tasks?.length === 0 && <p>No tasks yet.</p>}
      </div>
    </div>
  );
};
`,
  'src/pages/Tasks.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const Tasks: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/tasks');
      return res.data.tasks;
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <button className="btn btn-primary">New Task</button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data?.map((task: any) => (
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
      </div>
    </div>
  );
};
`,
  'src/pages/TaskDetail.tsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../api/client';

export const TaskDetail: React.FC = () => {
  const { id } = useParams();
  
  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const res = await apiClient.get(\`/tasks/\${id}\`);
      return res.data;
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div>
      <Link to="/tasks" style={{ color: 'var(--color-ink-secondary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Tasks
      </Link>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <span className="badge">{data.status}</span>
        <span className={\`badge priority-\${data.priority.toLowerCase()}\`}>{data.priority}</span>
      </div>

      <div className="page-header">
        <h1 className="page-title">{data.title}</h1>
      </div>
      
      <div className="card">
        <h3>Description</h3>
        <p style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{data.description || 'No description provided.'}</p>
      </div>

      <div className="card">
        <h3>Project</h3>
        <p style={{ marginTop: '0.5rem' }}>
          {data.project ? (
             <Link to={\`/projects/\${data.projectId}\`} style={{ color: 'var(--color-accent-primary)' }}>
               {data.project.name}
             </Link>
          ) : 'Unassigned'}
        </p>
      </div>
    </div>
  );
};
`,
  'src/App.tsx': `import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';

import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Tasks } from './pages/Tasks';
import { TaskDetail } from './pages/TaskDetail';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(process.cwd(), filepath), content);
}
console.log("Web dash generated");
