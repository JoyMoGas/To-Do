import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { searchUsers } from '../api/profile';
import { updateTaskList } from '../api/taskLists';
import { Avatar } from './Avatar';

export const ShareListModal = ({ isOpen, onClose, list, onUpdateList }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sharedUsers, setSharedUsers] = useState(list?.shared_with_users || []);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await searchUsers(query);
      setResults(res);
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (user) => {
    // Si ya está compartido, lo ignoramos por ahora o mostramos mensaje
    if (sharedUsers.find(u => u.id === user.id)) return;
    try {
      const newSharedIds = [...sharedUsers.map(u => u.id), user.id];
      const updated = await updateTaskList(list.id, { shared_with: newSharedIds });
      setSharedUsers(updated.shared_with_users);
      onUpdateList(updated);
    } catch(err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId) => {
    try {
      const newSharedIds = sharedUsers.filter(u => u.id !== userId).map(u => u.id);
      const updated = await updateTaskList(list.id, { shared_with: newSharedIds });
      setSharedUsers(updated.shared_with_users);
      onUpdateList(updated);
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 24, top: 24, color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Compartir Lista</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Comparte "{list?.name}" con tus amigos.</p>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 14, color: 'var(--text-secondary)' }} />
            <input
              style={{ width: '100%', padding: '12px 16px 12px 40px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem' }}
              type="text"
              placeholder="Buscar por usuario o email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '0 20px', background: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
            {loading ? '...' : 'Buscar'}
          </button>
        </form>

        {results.length > 0 && (
          <div style={{ marginBottom: '24px', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px', background: 'var(--bg-color)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Resultados</span>
            {results.map(user => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Avatar username={user.username} size={32} />
                  <span style={{ fontWeight: '500' }}>{user.username}</span>
                </div>
                <button 
                  onClick={() => handleShare(user)}
                  disabled={sharedUsers.find(u => u.id === user.id)}
                  style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: '600' }}
                >
                  {sharedUsers.find(u => u.id === user.id) ? 'Añadido' : 'Añadir'}
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Compartido con ({sharedUsers.length}):</h3>
          {sharedUsers.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No has compartido esta lista aún.</p>
          ) : (
            sharedUsers.map(user => (
              <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-color)', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Avatar username={user.username} size={32} />
                  <span style={{ fontWeight: '500' }}>{user.username}</span>
                </div>
                <button onClick={() => handleRemove(user.id)} style={{ color: '#ef4444' }}>
                  <X size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
