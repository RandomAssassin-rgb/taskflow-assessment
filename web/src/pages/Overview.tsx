import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Link } from 'react-router-dom';

export const Overview: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card">
          <h3 style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>Total Projects</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data?.totalProjects || 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>Total Tasks</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>{data?.totalTasks || 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>Completed Tasks</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-success)' }}>{data?.completedTasks || 0}</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--color-ink-secondary)', fontSize: '0.875rem' }}>Pending Tasks</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--color-warning)' }}>{data?.pendingTasks || 0}</p>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Projects</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {data?.recentProjects?.map((project: any) => (
          <Link to={`/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
            <div className="card">
              <h3>{project.name}</h3>
              <p style={{ color: 'var(--color-ink-secondary)' }}>{project.status}</p>
            </div>
          </Link>
        ))}
        {(!data?.recentProjects || data.recentProjects.length === 0) && <p style={{color: 'var(--color-ink-secondary)'}}>No projects yet.</p>}
      </div>
    </div>
  );
};
