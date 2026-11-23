import { useEffect, useState } from "react"

export default function Tasks({ t }) {
    const [tasks, setTasks] = useState([])
    const [text, setText] = useState("")


    useEffect(() => {
        fetch("/api/tasks")
            .then((response) => response.json())
            .then((data) => setTasks(data.tasks || []))
    }, [])

    async function addTask(event) {
        event.preventDefault()
        const clean = text.trim()
        if (clean === "") return

        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ text: clean}),
        })
        if (!response.ok) return

        const task = await response.json()
        setTasks([task, ...tasks])
        setText("")
    }

    async function toggleTask(task) {
        const done = !task.done
        setTasks(tasks.map((x) => (x.id === task.id ? { ...x, done} : x)))

        await fetch("/api/tasks/" + task.id, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ done }),
        })
    }

    async function deleteTask(id) {
        setTasks(tasks.filter((x) => x.id !== id))
        await fetch("/api/tasks/" + id, { method: "DELETE"})
    }

    return <div className="tasks">
        <h3>{t.tasksTitle}</h3>

        <form onSubmit={addTask} className="task-form">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t.taskPlaceholder}
            maxLength={100}  />
            <button type="submit">{t.taskAdd}</button>
        </form>

        {tasks.length === 0 && <p className="muted">{t.tasksEmpty}</p>}

        <ul className="task-list">
            {tasks.map((task) => (
                <li key={task.id} className={task.done ? "task done" : "task"}>
                    <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)} />
                    <span>{task.text}</span>
                    <button className="task-delete" type="button" aria-label={t.taskDelete} onClick={() => deleteTask(task.id)}>×</button>
                </li>
            ))}
        </ul>
    </div>
}