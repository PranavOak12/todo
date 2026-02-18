const { useState, useEffect } = React;

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const API = "https://todo-pkpr.onrender.com/api/todos";


  useEffect(() => {
    fetch(API).then(r => r.json()).then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!text) return;

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const todo = await res.json();
    setTodos([...todos, todo]);
    setText("");
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="card">
      <h1>📝 Todo</h1>

      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What to do?"
      />

      <button onClick={addTodo}>Add</button>

      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.text}
            <span onClick={() => deleteTodo(t.id)}>❌</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
