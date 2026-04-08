import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link and useNavigate
import API from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // Added default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      alert(res.data.message);
      navigate("/login"); // Redirect to login after successful registration
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // --- Matching Styles ---
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
    select: {
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #ddd",
      fontSize: "16px",
      backgroundColor: "white",
      cursor: "pointer",
    },
    button: {
      padding: "12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#007bff",
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
      color: "#28a745", // Green to match your login button color
      textDecoration: "none",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={styles.input}
            value={form.name}
            onChange={handleChange}
            required
          />

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

          {/* Added Role Selection */}
          <select 
            name="role" 
            value={form.role} 
            onChange={handleChange} 
            style={styles.select}
          >
            <option value="student">Student</option>
            <option value="librarian">Librarian</option>
          </select>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Register
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;