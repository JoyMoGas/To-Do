import React, { useState } from 'react';
import { updateProfile } from '../api/profile';
import { X, Upload } from 'lucide-react';
import { Avatar } from './Avatar';

const THEMES = [
  { id: 'light', name: 'Claro', color: '#f8fafc' },
  { id: 'dark', name: 'Oscuro', color: '#0f172a' },
  { id: 'cream', name: 'Crema', color: '#fdfbf7' },
  { id: 'pink', name: 'Rosita', color: '#fff0f3' }
];

export const SettingsModal = ({ isOpen, onClose, profile, username, onProfileUpdate }) => {
  const [theme, setTheme] = useState(profile?.theme || 'light');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(profile?.profile_picture);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('theme', theme);
      if (file) {
        formData.append('profile_picture', file);
      }
      const updated = await updateProfile(formData);
      document.body.setAttribute('data-theme', updated.theme);
      onProfileUpdate(updated);
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
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '500px', padding: '32px', position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', right: 24, top: 24, color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Ajustes del Perfil</h2>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Avatar profilePicture={preview} username={username} size={100} />
            <label style={{
              position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-color)', color: 'white',
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: '2px solid var(--bg-card)'
            }}>
              <Upload size={16} />
              <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*" />
            </label>
          </div>
          <div style={{ fontWeight: '600', fontSize: '1.2rem' }}>{username}</div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Tema de la Aplicación</h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            {THEMES.map(t => (
              <div 
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  flex: 1, 
                  height: 60, 
                  background: t.color, 
                  borderRadius: 8, 
                  border: theme === t.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.id === 'dark' ? '#fff' : '#000',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  boxShadow: theme === t.id ? '0 0 0 3px rgba(59, 130, 246, 0.2)' : 'none'
                }}
              >
                {t.name}
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          style={{
            width: '100%', padding: '14px', background: 'var(--accent-color)', color: 'white', 
            borderRadius: '8px', fontWeight: '600', opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};
