import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      alert(res.data.message);
      
      // Store Auth Data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role-Based Redirection
      if (res.data.user.role === "librarian") {
        navigate("/librarian");
      } else {
        navigate("/student");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // --- Styles ---
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f4f7f6",
    },
    card: {
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
      width: "100%",
      maxWidth: "400px",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      padding: "12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#28a745", // Green for Login
      color: "white",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background 0.3s ease",
    },
    footerText: {
      marginTop: "20px",
      textAlign: "center",
      fontSize: "14px",
      color: "#666",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
          >
            Login
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;