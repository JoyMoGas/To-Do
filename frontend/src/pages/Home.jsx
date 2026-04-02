import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import { getProfile } from "../api/profile";
import { getTaskLists, createTaskList } from "../api/taskLists";
import { getActivities, createActivity, updateActivity, deleteActivity } from "../api/activities";
import { getSections, createSection, deleteSection } from "../api/sections";

import { Sidebar } from "../components/Sidebar";
import { SettingsModal } from "../components/SettingsModal";
import { CreateListModal } from "../components/CreateListModal";
import { ShareListModal } from "../components/ShareListModal";
import { CreateSectionModal } from "../components/CreateSectionModal";
import { Avatar } from "../components/Avatar";
import { Menu, Plus, Check, Trash2, Edit2, Columns } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [taskLists, setTaskLists] = useState([]);
  const [activeList, setActiveList] = useState(null); // null = General (Todas)
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isShareListOpen, setIsShareListOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [listToShare, setListToShare] = useState(null);

  // New task state
  const [activeSectionId, setActiveSectionId] = useState(null); // Para saber en qué sección se está creando una tarea
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const username = localStorage.getItem("username") || "Usuario";

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, lists] = await Promise.all([
          getProfile(),
          getTaskLists()
        ]);
        setProfile(prof);
        document.body.setAttribute('data-theme', prof.theme || 'cream');
        setTaskLists(lists);
      } catch (err) {
        console.error("Error fetching init data", err);
        if (err.response?.status === 401) handleLogout();
      }
    };
    fetchData();
  }, [handleLogout]);

  // Cargar Tareas y Secciones dependiendo de la lista activa
  useEffect(() => {
    const fetchListContent = async () => {
      setLoadingTasks(true);
      try {
        const [tasksData, sectionsData] = await Promise.all([
          getActivities(activeList),
          activeList ? getSections(activeList) : Promise.resolve([])
        ]);
        setTasks(tasksData);
        setSections(sectionsData);
        // Si cambiamos de lista, cerramos el formulario de creación de tarea
        setActiveSectionId(null);
        setNewTaskTitle("");
        setNewTaskDesc("");
      } catch (err) {
        console.error("Error fetching content", err);
        if (err.response?.status === 401) handleLogout();
      } finally {
        setLoadingTasks(false);
      }
    };
    fetchListContent();
  }, [activeList, handleLogout]);

  // Manejo de Secciones
  const handleCreateSection = async (name) => {
    if (!activeList) return;
    try {
      const created = await createSection(name, activeList);
      setSections([...sections, created]);
    } catch(err) {
      console.error(err);
    }
  };

  const handleDeleteSection = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta sección? Las tareas podrían quedar marcadas como Generales o ser eliminadas según la configuración.")) {
      try {
        await deleteSection(id);
        setSections(sections.filter(s => s.id !== id));
        // Actualizamos las tareas borrando localmente o trayendo de nuevo
        const tsks = await getActivities(activeList);
        setTasks(tsks);
      } catch(err) {
        console.error(err);
      }
    }
  }

  // Manejo de Tareas
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setIsAddingTask(true);
    // target section parameter depends on which block form is active
    let targetSectionId = activeSectionId;
    if (targetSectionId === 'general') targetSectionId = null; 

    try {
      const created = await createActivity(newTaskTitle, newTaskDesc, activeList, targetSectionId);
      setTasks([...tasks, created]);
      setNewTaskTitle("");
      setNewTaskDesc("");
      setActiveSectionId(null);
    } catch(err) {
      console.error(err);
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updated = await updateActivity(task.id, { completed: !task.completed });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
    } catch(err) {
       console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteActivity(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch(err) {
       console.error(err);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const updated = await updateActivity(id, { title: editTitle, description: editDesc });
      setTasks(tasks.map(t => t.id === id ? updated : t));
      setEditingTaskId(null);
    } catch(err) {
      console.error(err);
    }
  };

  const handleCreateList = async (name) => {
    const created = await createTaskList(name);
    setTaskLists([...taskLists, created]);
    setActiveList(created.id);
  };

  const handleUpdateList = (updated) => {
    setTaskLists(taskLists.map(l => l.id === updated.id ? updated : l));
  };

  const getListName = () => {
    if (activeList === null) return "Todas las Tareas";
    const list = taskLists.find(l => l.id === activeList);
    return list ? list.name : "Lista Desconocida";
  };

  const activeListObj = taskLists.find(l => l.id === activeList);

  // Funciones Utilitarias para la vista
  const openTaskForm = (sectionId) => {
    setActiveSectionId(sectionId);
    setNewTaskTitle("");
    setNewTaskDesc("");
  };

  // Extraer Tareas Agrupadas
  const groupedTasks = useMemo(() => {
    if (activeList === null) {
      // En "Todas las Tareas" mostramos todas mezcladas pero podemos agruparlas por Lista original
      return [{ id: 'all', name: 'Todas las tareas', tasks }];
    }

    // Y si estamos en una lista...
    const groups = [];
    
    // Primero: Tareas sin Sección (Generales)
    const generalTasks = tasks.filter(t => !t.section);
    if (generalTasks.length > 0 || sections.length === 0) {
      groups.push({ id: 'general', name: 'General', tasks: generalTasks });
    }

    // Despues: Cada Sección
    sections.forEach(sec => {
      groups.push({
        id: sec.id,
        name: sec.name,
        tasks: tasks.filter(t => t.section === sec.id)
      });
    });

    return groups;
  }, [tasks, sections, activeList]);


  const renderTask = (task) => (
    <motion.div 
      key={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      layout
      style={{ padding: '20px', marginBottom: '16px', display: 'flex', gap: '20px', opacity: task.completed ? 0.6 : 1, transition: 'opacity 0.3s ease', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-color)' }}
    >
      <button 
        onClick={() => handleToggleTask(task)}
        style={{ width: 24, height: 24, borderRadius: '6px', border: `2px solid ${task.completed ? 'var(--accent-color)' : 'var(--border-color)'}`, background: task.completed ? 'var(--accent-color)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4, transition: 'all 0.2s ease' }}
      >
        {task.completed && <Check size={16} color="white" />}
      </button>
      
      <div style={{ flex: 1 }}>
        {editingTaskId === task.id ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-sidebar)', color: 'var(--text-primary)' }}
              autoFocus 
            />
            <textarea 
              value={editDesc} 
              onChange={e => setEditDesc(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'var(--bg-sidebar)', color: 'var(--text-primary)', minHeight: '60px' }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleSaveEdit(task.id)} style={{ padding: '6px 16px', background: 'var(--accent-color)', color: 'white', borderRadius: '4px', fontSize: '0.9rem' }}>Guardar</button>
              <button onClick={() => setEditingTaskId(null)} style={{ padding: '6px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px', fontSize: '0.9rem' }}>Cancelar</button>
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: '4px' }}>{task.title}</h3>
            {task.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '16px' }}>{task.description}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: task.description ? '0' : '16px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                <span>Creado por @{task.owner_username}</span>
                {activeList === null && task.task_list && <span>• En Lista Comp.</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setEditingTaskId(task.id); setEditTitle(task.title); setEditDesc(task.description || ''); }} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDeleteTask(task.id)} style={{ color: '#ef4444', padding: '4px' }}>
                  <Trash2 size={16} />
                </button>                               
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="app-layout">
      <Sidebar 
        username={username}
        profile={profile}
        activeList={activeList}
        setActiveList={setActiveList}
        taskLists={taskLists}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCreateList={() => setIsCreateListOpen(true)}
        onOpenShareList={(list) => { setListToShare(list); setIsShareListOpen(true); }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
            
            {/* Barra superior (Hamburger Menu + Avatar en top right) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="mobile-only" onClick={() => setIsSidebarOpen(true)} style={{ color: 'var(--text-primary)', padding: '4px' }}>
                  <Menu size={28} />
                </button>
                <div className="desktop-only" style={{ width: 1, height: 1 }} /> {/* Spacer */}
              </div>
              
              <div style={{ cursor: 'pointer' }} onClick={() => setIsSettingsOpen(true)} title="Ajustes de Perfil">
                <Avatar profilePicture={profile?.profile_picture} username={username} size={40} />
              </div>
            </div>

            {/* Título y Botones de Acción */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ flex: '1 1 min-content' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)', lineHeight: 1.2 }}>{getListName()}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                  {activeList === null ? "Visualiza todo tu trabajo en un solo lugar" : 
                    (activeListObj?.owner_username === username ? "Esta lista te pertenece" : `Compartida por @${activeListObj?.owner_username}`)}
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                {activeList && (
                  <button 
                    onClick={() => setIsCreateSectionOpen(true)}
                    style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', fontWeight: '600', whiteSpace: 'nowrap' }}
                  >
                    <Columns size={18} />
                    Añadir Sección
                  </button>
                )}
                {activeList && activeListObj?.owner_username === username && (
                  <button 
                    onClick={() => { setListToShare(activeListObj); setIsShareListOpen(true); }}
                    style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent-color)', color: 'white', borderRadius: '8px', fontWeight: '600', whiteSpace: 'nowrap' }}
                  >
                    Compartir Lista
                  </button>
                )}
              </div>
            </div>
            
          </div>

          {loadingTasks ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>Cargando tareas...</div>
          ) : (
            <div>
              {groupedTasks.map(group => (
                <div key={group.id} style={{ marginBottom: '48px' }}>
                  {/* Encabezado de la Sección */}
                  {(activeList !== null || group.name !== 'Todas las tareas') && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {group.name}
                      </h2>
                      {group.id !== 'general' && group.id !== 'all' && (
                        <button onClick={() => handleDeleteSection(group.id)} style={{ color: 'var(--text-secondary)', padding: '4px' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Render de Tareas de la Sección */}
                  <AnimatePresence>
                    {group.tasks.map(task => renderTask(task))}
                  </AnimatePresence>

                  {/* Formulario / Botón de Añadir dentro de la Sección */}
                  {activeList !== null && (
                    activeSectionId === group.id ? (
                      <form onSubmit={handleCreateTask} className="glass-panel" style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', padding: '16px 20px', gap: '16px', borderBottom: newTaskDesc || newTaskTitle ? '1px solid var(--border-color)' : 'none' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '6px', border: '2px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                            <Plus size={16} color="var(--border-color)" />
                          </div>
                          <input 
                            type="text" 
                            placeholder="Añadir una nueva tarea..." 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1.1rem', color: 'var(--text-primary)', outline: 'none' }}
                            autoFocus
                          />
                        </div>
                        
                        <AnimatePresence>
                          {(newTaskTitle.length > 0 || newTaskDesc.length > 0) && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div style={{ padding: '16px 20px 16px 60px', borderTop: '1px solid var(--border-color)' }}>
                                <textarea 
                                  placeholder="Añadir descripción o notas..."
                                  value={newTaskDesc}
                                  onChange={(e) => setNewTaskDesc(e.target.value)}
                                  style={{ width: '100%', border: 'none', background: 'transparent', resize: 'vertical', minHeight: '60px', color: 'var(--text-secondary)', outline: 'none', fontSize: '0.95rem' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '8px' }}>
                                  <button 
                                    type="button" 
                                    onClick={() => setActiveSectionId(null)}
                                    style={{ padding: '8px 24px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', fontWeight: '500' }}
                                  >
                                    Cancelar
                                  </button>
                                  <button 
                                    type="submit" 
                                    disabled={isAddingTask || !newTaskTitle.trim()}
                                    style={{ padding: '8px 24px', background: 'var(--accent-color)', color: 'white', borderRadius: '6px', fontWeight: '500', opacity: (!newTaskTitle.trim() || isAddingTask) ? 0.6 : 1 }}
                                  >
                                    {isAddingTask ? 'Guardando...' : 'Añadir'}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </form>
                    ) : (
                      <button 
                        onClick={() => openTaskForm(group.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', width: '100%', background: 'transparent', border: '2px dashed var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: '500', transition: 'all 0.2s', marginTop: '16px' }}
                      >
                        <Plus size={18} />
                        Añadir tarea en {group.name}
                      </button>
                    )
                  )}

                  {group.tasks.length === 0 && activeList === null && (
                     <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '60px 0', border: '2px dashed var(--border-color)', borderRadius: '16px' }}>
                      <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-state-2130362-1800926.png" alt="Vacío" style={{ width: '150px', opacity: 0.5, marginBottom: '20px', mixBlendMode: 'multiply' }} />
                      <h3>Nada por hacer aquí</h3>
                      <p style={{ marginTop: '8px' }}>Disfruta de tu tiempo o crea nuevas tareas.</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        profile={profile} 
        username={username}
        onProfileUpdate={setProfile}
      />
      <CreateListModal 
        isOpen={isCreateListOpen} 
        onClose={() => setIsCreateListOpen(false)}
        onCreate={handleCreateList} 
      />
      <ShareListModal 
        isOpen={isShareListOpen} 
        onClose={() => setIsShareListOpen(false)} 
        list={listToShare}
        onUpdateList={handleUpdateList}
      />
      <CreateSectionModal
        isOpen={isCreateSectionOpen}
        onClose={() => setIsCreateSectionOpen(false)}
        onCreate={handleCreateSection}
      />
    </div>
  );
};

export default Home;
