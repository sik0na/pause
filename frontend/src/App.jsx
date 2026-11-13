import { useEffect, useState } from "react"
import Login from "./Login.jsx"
import Dashboard from "./Dashboard.jsx"
import Settings from "./Settings.jsx"
import { TEXTS } from "./texts.js"

export default function App() {
  const [checking, setChecking] = useState(true)
  const [username, setUsername] = useState(null)
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en")
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )
  const [tab, setTab] = useState("today")

  const t = TEXTS[lang]

  useEffect(() => {
    fetch("/api/me")
      .then((response) => response.json())
      .then((data) => {
        if (data.logged_in) {
          setUsername(data.username)
        }
        setChecking(false)
      })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  async function logout() {
    await fetch("/api/logout", { method: "POST" })
    setUsername(null)
    setTab("today")
  }

  function changeLanguage(newLang) {
    setLang(newLang)
    localStorage.setItem("lang", newLang)
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (checking) {
    return <p className="muted center">{t.loading}</p>
  }

  return (
    <>
      <header className="topbar">
        <Settings t={t} lang={lang} onLanguage={changeLanguage}
                  theme={theme} onTheme={toggleTheme}
                  loggedIn={username !== null}
                  onProfile={() => setTab("profile")}
                  onLogout={logout} />
      </header>

      {username === null
        ? <Login t={t} onLoggedIn={setUsername} />
        : <Dashboard t={t} lang={lang} username={username} tab={tab} setTab={setTab} />}
    </>
  )
}