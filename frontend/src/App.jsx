import { useEffect, useState } from "react";
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"

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

  // Logged in: the dashboard (it shows the greeting and the Log out button itself)
  return <Dashboard username={username} onLogout={logout} />
}