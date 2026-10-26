import { useEffect, useState } from "react";
import Login from "./Login.jsx"

export default function App() {
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState(null)

  useEffect(()=> {
    fetch("/api/me")
    .then((response) => response.json())
    .then((data) => {
      if (data.logged_in) {
        setUsername(data.username)
      }
      setChecking(false)
    })
  }, [])

  async function logout() {
    await fetch("/api/logout", {method: "POST"})
    setUsername(null)
  }
  
  if (checking) {
    return <p className="muted center">Loading...</p>
  }

  if (username === null) {
    return <Login onLoggedIn={setUsername}></Login>
  }

  // Logged in (the real dashboard comes in Step 14)
  return (
    <main>
      <div className="card">
        <h1>Hi, {username} 👋</h1>
        <p className="muted">You're logged in. Your dashboard comes in the next step.</p>
        <button className="secondary" onClick={logout}>Log out</button>
      </div>
    </main>
  )
}