import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      // redirigir al home tras éxito
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "450px", marginTop: "40px" }}>
      <div className="header">
        <h2>Bienvenido de vuelta</h2>
        <p>Inicia sesión para ver tus tareas</p>
      </div>

      <form className="task-form" onSubmit={handleLogin} style={{ marginBottom: "0" }}>
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
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default Login;
