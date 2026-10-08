import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export const Dashboard: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get('/dashboard');
      return res.data.data;
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
            {data?.projectsInProgress || 0}
          </div>
          <p>Active Projects</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-ink-primary)' }}>
            {data?.pendingTasks || 0}
          </div>
          <p>Tasks Due Soon</p>
        </div>
        <div className="card">
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-ink-primary)' }}>
            {data?.completedTasks || 0}
          </div>
          <p>Completed Today</p>
        </div>
      </div>
    </div>
  );
};
