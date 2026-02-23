import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, Plus, LogOut, Search,
  LayoutDashboard, PieChart, Settings, Briefcase, Heart, Calendar 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer 
} from "recharts";

function App() {
  // --- STATE ---
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(true);
  const [view, setView] = useState("dashboard");
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Personal");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- LOGIC ---
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAuth = async () => {
    try {
      const url = isLogin ? "http://localhost:5000/auth/login" : "http://localhost:5000/auth/register";
      const payload = isLogin ? { email, password } : { name, email, password };
      const res = await axios.post(url, payload);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
      } else {
        alert("Success! Please login.");
        setIsLogin(true);
      }
    } catch (err) { alert(err.response?.data?.message || "Auth error"); }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    const taskData = { title, dueDate: dueDate || null, category, progress: 0, completed: false };
    try {
      const res = await axios.post("http://localhost:5000/tasks", taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks([...tasks, res.data]);
      setTitle(""); setDueDate("");
    } catch (err) { alert("Error saving to MongoDB"); }
  };

  const updateProgress = async (id, newProgress) => {
    const progressNum = Number(newProgress);

    // 1. Optimistic Update: Change the slider instantly in UI
    setTasks(prevTasks => 
      prevTasks.map(t => t._id === id ? { ...t, progress: progressNum } : t)
    );

    try {
      const res = await axios.put(`http://localhost:5000/tasks/${id}`, 
        { progress: progressNum, completed: progressNum === 100 }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2. Sync with server response
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.error("Momentum sync failed:", err);
      fetchTasks(); // Rollback on failure
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setTasks([]);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getUrgencyClass = (dueDate) => {
  if (!dueDate) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dueDate);
  date.setHours(0, 0, 0, 0);

  if (date < today) return "overdue"; // Date has passed
  if (date.getTime() === today.getTime()) return "due-today"; // Due today
  return "";
};

   if (!token) {
  return (
    <div className="auth-viewport">
      <div className="auth-background-glow" /> {/* Decorative glow */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="auth-card"
      >
        <motion.div 
          key={task._id} 
          layout 
          className={`task-card-premium ${task.completed ? 'is-done' : ''} ${getUrgencyClass(task.dueDate)}`}
      ></motion.div>
        <div className="sidebar-brand auth-logo">FOCUS<span>FLOW</span></div>
        <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className="auth-subtitle">Elevate your daily momentum</p>
        
        <div className="auth-form">
          {!isLogin && (
             <div className="auth-input-wrapper password-field">
  <input 
    type={showPassword ? "text" : "password"} // Switches between text and dots
    placeholder="Password" 
    value={password} 
    onChange={(e) => setPassword(e.target.value)} 
  />
  <button 
    type="button"
    className="password-toggle-icon"
    onClick={() => setShowPassword(!showPassword)} // Toggles the state
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
          )}
          <div className="auth-input-wrapper">
            <input 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="auth-input-wrapper">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button className="auth-main-btn" onClick={handleAuth}>
            {isLogin ? "Sign In" : "Get Started"}
          </button>
        </div>

        <p className="toggle-auth" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? " : "Already a member? "}
          <span>{isLogin ? "Sign Up" : "Login"}</span>
        </p>
        <span className="deadline-text">
       <Calendar size={12} /> 
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Unscheduled'}
        {/* This adds a red/orange dot if it's urgent */}
        {getUrgencyClass(task.dueDate) && <span className="urgency-dot">●</span>}
         </span>
      </motion.div>
    </div>
  );
}

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">FOCUS<span>FLOW</span></div>
        <nav className="nav-list">
          <div className={`nav-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><LayoutDashboard size={18}/> Dashboard</div>
          <div className={`nav-item ${view === 'analytics' ? 'active' : ''}`} onClick={() => setView('analytics')}><PieChart size={18}/> Analytics</div>
          <div className={`nav-item ${view === 'settings' ? 'active' : ''}`} onClick={() => setView('settings')}><Settings size={18}/> Settings</div>
        </nav>
        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn"><LogOut size={16}/> Logout</button>
        </div>
      </aside>

      <main className="main-body">
        <header className="top-nav">
          <div className="search-wrapper">
            <Search size={16} color="var(--text-dim)" />
            <input className="main-search-input" placeholder="Search goals..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <span className="search-hint">Ctrl + K</span>
          </div>
          <div className="user-info">Himangi ✨</div>
        </header>

        <div className="content-container">
          {view === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="dashboard-hero">
                <div className="hero-text">
                  <h1>Focus, Himangi</h1>
                  <p>You have {tasks.filter(t => !t.completed).length} missions remaining today.</p>
                </div>
                <div className="quick-stats">
                  <div className="mini-stat">
                    <div className="stat-icon career"><Briefcase size={16} /></div>
                    <div className="stat-data"><span>Career</span><p>{tasks.filter(t => t.category === "Career").length}</p></div>
                  </div>
                  <div className="mini-stat">
                    <div className="stat-icon personal"><Heart size={16} /></div>
                    <div className="stat-data"><span>Personal</span><p>{tasks.filter(t => t.category === "Personal").length}</p></div>
                  </div>
                </div>
              </div>

              <div className="input-paddock">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Define your next mission..." className="main-input" />
                <div className="input-group-right">
                  <select className="scheme-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Personal">Personal</option>
                    <option value="Career">Career</option>
                  </select>
                  <input type="date" className="scheme-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                  <button onClick={addTask} className="add-btn-primary"><Plus size={18} /> Add</button>
                </div>
              </div>

              <div className="task-scroll">
                <AnimatePresence mode="popLayout">
                  {filteredTasks.map(task => (
                    <motion.div key={task._id} layout className={`task-card-premium ${task.completed ? 'is-done' : ''}`}>
                      <div className="card-top">
                        <span className="category-pill">{task.category}</span>
                        <p className="task-title-text">{task.title}</p>
                      </div>
                      <div className="card-middle">
                        <div className="momentum-header"><label>Momentum</label><span>{task.progress ?? 0}%</span></div>
                        <input type="range" min="0" max="100" step="1" value={task.progress ?? 0} onChange={(e) => updateProgress(task._id, e.target.value)} className="momentum-slider" />
                      </div>
                      <div className="card-bottom">
                        <span className="deadline-text"><Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Unscheduled'}</span>
                        <button className="delete-icon-btn" onClick={() => deleteTask(task._id)}><Trash2 size={16}/></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === "analytics" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="analytics-view">
              <div className="analytics-header"><h2>Performance Overview</h2><p>Tracking momentum across {tasks.length} goals.</p></div>
              <div className="analytics-grid">
                <div className="glass-card"><span>Avg Momentum</span><h3>{tasks.length > 0 ? Math.round(tasks.reduce((acc, curr) => acc + curr.progress, 0) / tasks.length) : 0}%</h3></div>
                <div className="glass-card"><span>Completed Tasks</span><h3>{tasks.filter(t => t.completed).length}</h3></div>
              </div>
              <div className="chart-wrapper-glass">
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tasks}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity={1}/>
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="title" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '12px'}} />
                      <Bar dataKey="progress" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;