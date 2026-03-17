import { useState } from "react";
import { register, login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(username, password);
      // Tras registrar exitosamente, iniciar sesión automáticamente
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.username) {
        setError("Ese nombre de usuario ya existe.");
      } else {
        setError("Error al registrar usuario. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px", marginTop: "40px" }}>
      <div className="header">
        <h2>Crear Cuenta</h2>
        <p>Regístrate para guardar tus tareas</p>
      </div>

      <form className="task-form" onSubmit={handleRegister} style={{ marginBottom: "0" }}>
        {error && (
          <div style={{ color: "#c95c5c", marginBottom: "10px", textAlign: "center", fontStyle: "italic", fontSize: "0.95rem" }}>
            {error}
          </div>
        )}
        <input
          className="input-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          autoFocus
        />
        <input
          className="input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
        <input
          className="input-field"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar Contraseña"
        />
        <button
          className="btn"
          type="submit"
          disabled={isLoading}
          style={{
            opacity: isLoading ? 0.7 : 1,
            cursor: isLoading ? "not-allowed" : "pointer",
            marginTop: "10px"
          }}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#666" }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: "#3498db", textDecoration: "none", fontWeight: "bold" }}>Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
