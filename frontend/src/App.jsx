import { useEffect, useState } from "react";
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import { TEXTS } from "./texts.js" 

export default function App() {
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState(null)
  const  [lang, setLang] = useState(localStorage.getItem("lang") || "en")

  const t = TEXTS[lang]

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
  function changeLanguage(newLang) {
    setLang(newLang)
    localStorage.setItem("lang", newLang)
  }
  
  if (checking) {
    return <p className="muted center">{t.loading}</p>
  }

  return (
    <>
      <div className="languages">
        {Object.keys(TEXTS).map((code) => (
          <button key={code} type="button" className={code === lang ? "language active" : "language"} onClick={()=> changeLanguage(code)}>
            {TEXTS[code].languageName}
          </button>
        ))}
      </div>

      {username === null ? <Login t={t} onLoggedIn={setUsername}/>
      : <Dashboard t={t} username = {username} onLogout={logout}/>}
    </>
  )
}