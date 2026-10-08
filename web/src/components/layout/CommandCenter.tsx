import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Folder, CheckSquare, X } from 'lucide-react';
import { apiClient } from '../../api/client';
import './CommandCenter.css';

export const CommandCenter = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await apiClient.get('/projects');
      return res.data.data;
    },
    enabled: open,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await apiClient.get('/tasks');
      return res.data.data;
    },
    enabled: open,
  });

  const filteredProjects = projects.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredTasks = tasks.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase()));

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={() => setOpen(false)}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-header">
          <Search size={18} className="cmd-icon" />
          <input
            autoFocus
            className="cmd-input"
            placeholder="What do you want to do? (e.g. Search tasks, projects)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="cmd-close" onClick={() => setOpen(false)}>
            <X size={16} />
          </button>
        </div>
        
        <div className="cmd-body">
          {search && filteredProjects.length === 0 && filteredTasks.length === 0 && (
            <div className="cmd-empty">No results found for "{search}"</div>
          )}

          {filteredProjects.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-title">Projects</div>
              {filteredProjects.map((p: any) => (
                <div
                  key={p.id}
                  className="cmd-item"
                  onClick={() => {
                    navigate(`/projects/${p.id}`);
                    setOpen(false);
                  }}
                >
                  <Folder size={16} className="cmd-item-icon" />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}

          {filteredTasks.length > 0 && (
            <div className="cmd-group">
              <div className="cmd-group-title">Tasks</div>
              {filteredTasks.map((t: any) => (
                <div
                  key={t.id}
                  className="cmd-item"
                  onClick={() => {
                    navigate(`/tasks`);
                    setOpen(false);
                  }}
                >
                  <CheckSquare size={16} className="cmd-item-icon" />
                  <span>{t.name}</span>
                  <span className="cmd-item-sub">in Project</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="cmd-footer">
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>↵</kbd> to select</span>
          <span><kbd>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
};
