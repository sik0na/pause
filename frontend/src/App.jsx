import { useEffect, useState } from "react";
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import { TEXTS } from "./texts.js" 

export default function App() {
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState(null)
  const  [lang, setLang] = useState(localStorage.getItem("lang") || "en")
  const [theme, setTheme] = useState(localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

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

        <button className="language theme-toggle" onClick={toggleTheme} type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {theme === "dark" ? <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            }
          </svg>
          {theme === "dark" ? t.lightMode : t.darkMode}
        </button>
      </div>

      {username === null ? <Login t={t} onLoggedIn={setUsername}/>
      : <Dashboard t={t} lang={lang} username = {username} onLogout={logout}/>}
    </>
  )
}