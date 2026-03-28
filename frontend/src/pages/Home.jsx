import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to Contact Sync</h1>

      <button onClick={() => navigate("/login")} style={{ margin: "10px" }}>
        Login
      </button>

      <button onClick={() => navigate("/register")} style={{ margin: "10px" }}>
        Sign Up
      </button>
    </div>
  );
}

export default Home;