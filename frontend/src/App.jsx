import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // ✅ make sure this line is here

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const res = await axios.post("http://localhost:5000/tasks", { title });
    setTasks([...tasks, res.data]);
    setTitle("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    const res = await axios.put(`http://localhost:5000/tasks/${id}`, {
      completed: !task.completed,
    });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const quotes = [
    "Believe in yourself 🌟",
    "Keep going 💪",
    "Dream. Plan. Do. 🚀",
    "Progress, not perfection ✨",
    "You’ve got this 🔥",
  ];

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(120deg, #d1c4e9, #b2ebf2)",
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* 🧚 Floating cute animated characters */}
      <div className="character char-left" aria-hidden="true">
        <div className="face">
          <div className="eye eye-left" />
          <div className="eye eye-right" />
          <div className="mouth" />
        </div>
        <div className="bubble">You got this!</div>
      </div>

      <div className="character char-right" aria-hidden="true">
        <div className="face face-2">
          <div className="eye eye-left" />
          <div className="eye eye-right" />
          <div className="mouth smile" />
        </div>
        <div className="bubble">One step at a time ✨</div>
      </div>

      {/* floating motivational quotes */}
      {quotes.map((q, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${10 + i * 15}%`,
            left: i % 2 === 0 ? `${5 + i * 12}%` : `${60 + i * 8}%`,
            background: "rgba(255,255,255,0.5)",
            color: "#4a148c",
            padding: "10px 16px",
            borderRadius: "20px",
            fontSize: "14px",
            animation: `float${i} 12s ease-in-out infinite`,
            whiteSpace: "nowrap",
            zIndex: 0,
          }}
        >
          {q}
        </div>
      ))}

      <style>
        {`
          @keyframes float0 {0%,100%{transform:translateY(0);}50%{transform:translateY(-25px);} }
          @keyframes float1 {0%,100%{transform:translateY(0);}50%{transform:translateY(30px);} }
          @keyframes float2 {0%,100%{transform:translateY(0);}50%{transform:translateY(-35px);} }
          @keyframes float3 {0%,100%{transform:translateY(0);}50%{transform:translateY(25px);} }
          @keyframes float4 {0%,100%{transform:translateY(0);}50%{transform:translateY(-20px);} }
        `}
      </style>

      {/* full-width main section */}
      <div
        style={{
          width: "100%",
          padding: "50px 5%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 25,
          zIndex: 1,
          position: "relative",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#4a148c",
            fontSize: "2.5rem",
            marginBottom: 10,
          }}
        >
          ✨ Task Manager
        </h1>

        {/* input and add button */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 15,
            width: "100%",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type a new task..."
            style={{
              flex: 1,
              padding: "12px 18px",
              border: "2px solid #d1c4e9",
              borderRadius: 10,
              fontSize: 16,
              outline: "none",
              maxWidth: "70%",
            }}
          />
          <button
            onClick={addTask}
            style={{
              background: "linear-gradient(135deg,#7e57c2,#ab47bc)",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16,
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Add
          </button>
        </div>

        {/* progress bar */}
        {tasks.length > 0 && (
          <div style={{ width: "80%", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 14,
                color: "#555",
                marginBottom: 5,
              }}
            >
              <span>
                Completed: {completedCount}/{tasks.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div
              style={{
                background: "#e0e0e0",
                height: 10,
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(135deg,#7e57c2,#ab47bc)",
                  transition: "width 0.4s ease",
                }}
              ></div>
            </div>
          </div>
        )}

        {/* task list full width */}
        <ul
          style={{
            listStyle: "none",
            margin: "30px auto",
            padding: 0,
            width: "80%",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          {tasks.length === 0 ? (
            <p style={{ textAlign: "center", color: "#555" }}>
              No tasks yet. Add one above! 🌸
            </p>
          ) : (
            tasks.map((task) => (
              <li
                key={task._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  marginBottom: 12,
                  background: task.completed ? "#e8f5e9" : "#f3e5f5",
                  borderRadius: 12,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <span
                  onClick={() => toggleTask(task._id)}
                  style={{
                    cursor: "pointer",
                    textDecoration: task.completed ? "line-through" : "none",
                    color: task.completed ? "#2e7d32" : "#4a148c",
                    fontWeight: 500,
                    flex: 1,
                  }}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => deleteTask(task._id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#d32f2f",
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.3)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "scale(1)")
                  }
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
