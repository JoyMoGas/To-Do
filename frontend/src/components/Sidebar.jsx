import React from "react";
import { LayoutDashboard, LogOut, CheckSquare, Plus, Settings, Share2, X } from "lucide-react";
import { Avatar } from "./Avatar";

export const Sidebar = ({
  username,
  profile,
  activeList,
  setActiveList,
  taskLists,
  onLogout,
  onOpenSettings,
  onOpenCreateList,
  onOpenShareList,
  isOpen, // Mobile prop
  onClose // Mobile prop
}) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckSquare size={28} color="var(--accent-color)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>To-Do</h1>
          </div>
          <button className="mobile-only" onClick={onClose} style={{ color: 'var(--text-secondary)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
            General
          </div>
          <button
            onClick={() => { setActiveList(null); onClose(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '10px 12px', borderRadius: '8px',
              background: activeList === null ? 'var(--bg-card)' : 'transparent',
              color: activeList === null ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontWeight: activeList === null ? '600' : '500',
              textAlign: 'left',
              border: activeList === null ? '1px solid var(--border-color)' : '1px solid transparent'
            }}
          >
            <LayoutDashboard size={18} />
            Todas las Tareas
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Listas Compartidas
            </div>
            <button onClick={onOpenCreateList} style={{ color: 'var(--text-secondary)' }}>
              <Plus size={16} />
            </button>
          </div>
          
          {taskLists.length === 0 ? (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', padding: '8px 0' }}>
              No tienes listas.
            </div>
          ) : (
            taskLists.map(list => (
              <div key={list.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                <button
                  onClick={() => { setActiveList(list.id); onClose(); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', flex: 1,
                    padding: '10px 12px', borderRadius: '8px',
                    background: activeList === list.id ? 'var(--bg-card)' : 'transparent',
                    color: activeList === list.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                    fontWeight: activeList === list.id ? '600' : '500',
                    textAlign: 'left',
                    border: activeList === list.id ? '1px solid var(--border-color)' : '1px solid transparent',
                    overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: list.owner_username === username ? 'var(--accent-color)' : '#10b981', flexShrink: 0 }} />
                  <span style={{flex: 1, overflow: 'hidden', textOverflow: 'ellipsis'}}>{list.name}</span>
                </button>
                {list.owner_username === username && (
                  <button 
                    onClick={() => onOpenShareList(list)}
                    style={{ color: 'var(--text-secondary)', padding: '8px', opacity: 0.6 }}
                    title="Compartir"
                  >
                    <Share2 size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }} onClick={onOpenSettings}>
            <Avatar profilePicture={profile?.profile_picture} username={username} size={40} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{username}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Ver perfil</div>
            </div>
            <Settings size={18} color="var(--text-secondary)" />
          </div>
          <button
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: '10px 12px', borderRadius: '8px', color: '#ef4444', fontWeight: '500'
            }}
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};
