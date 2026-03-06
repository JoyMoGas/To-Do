import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/activities/";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDesc, setEditingTaskDesc] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        const sorted = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setTasks(sorted);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    try {
      const response = await axios.post(API_URL, {
        title: newTaskTitle,
        description: newTaskDesc,
        completed: false,
      });
      setTasks([response.data, ...tasks]);
      setNewTaskTitle("");
      setNewTaskDesc("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTask = async (task) => {
    try {
      const response = await axios.patch(`${API_URL}${task.id}/`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const saveEditTask = async (task) => {
    if (!editingTaskTitle.trim()) {
      setEditingTaskId(null);
      return;
    }
    try {
      const response = await axios.patch(`${API_URL}${task.id}/`, {
        title: editingTaskTitle,
        description: editingTaskDesc,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
      setEditingTaskId(null);
      setEditingTaskTitle("");
      setEditingTaskDesc("");
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}${id}/`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="container">
      <div className="header">
        <h2>Mi Diario de Tareas</h2>
        <p>Organiza tu día con serenidad y claridad</p>
      </div>

      <form className="task-form" onSubmit={addTask}>
        <input
          className="input-field"
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="¿Qué necesitas hacer hoy?"
        />
        <textarea
          className="input-field"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          placeholder="Agrega notas o detalles adicionales..."
          rows={3}
        />
        <button className="btn" type="submit">
          Agregar Tarea
        </button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`task-card ${task.completed ? "completed" : ""}`}
          >
            <div className="checkbox-wrapper">
              <input
                className="custom-checkbox"
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task)}
              />
            </div>

            <div className="task-content">
              {editingTaskId === task.id ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <input
                    className="input-field"
                    type="text"
                    value={editingTaskTitle}
                    onChange={(e) => setEditingTaskTitle(e.target.value)}
                    autoFocus
                  />
                  <textarea
                    className="input-field"
                    value={editingTaskDesc}
                    onChange={(e) => setEditingTaskDesc(e.target.value)}
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button className="btn" onClick={() => saveEditTask(task)}>
                      Guardar cambios
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3
                    className="task-title"
                    onDoubleClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskTitle(task.title);
                      setEditingTaskDesc(task.description || "");
                    }}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="task-desc">{task.description}</p>
                  )}

                  <div className="task-meta">
                    <span className="task-date">
                      {formatDate(task.created_at)}
                    </span>
                    <div className="task-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingTaskId(task.id);
                          setEditingTaskTitle(task.title);
                          setEditingTaskDesc(task.description || "");
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => deleteTask(task.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
        {tasks.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#8C8681",
              marginTop: "30px",
              fontStyle: "italic",
              fontFamily: "Lora, serif",
            }}
          >
            No hay tareas aún. Disfruta la tranquilidad o añade una nueva.
          </p>
        )}
      </ul>
    </div>
  );
};

export default Home;
