import React, { useState } from 'react';
import { X } from 'lucide-react';

export const CreateSectionModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onCreate(name);
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '32px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 24, top: 24, color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Nueva Sección</h2>
        <form onSubmit={handleSubmit}>
          <input
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', marginBottom: '24px', fontSize: '1rem' }}
            type="text"
            placeholder="Nombre de la sección (ej. En Progreso)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading || !name.trim()} style={{
            width: '100%', padding: '14px', background: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontWeight: '600', opacity: loading || !name.trim() ? 0.7 : 1
          }}>
            {loading ? 'Creando...' : 'Crear Sección'}
          </button>
        </form>
      </div>
    </div>
  );
};
