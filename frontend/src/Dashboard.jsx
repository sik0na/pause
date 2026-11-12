import { useState } from "react"
import Results from "./Results.jsx"
import History from "./History.jsx"
import MoodCalendar from "./MoodCalendar.jsx"
import Today from "./Today.jsx"

const ICONS = {
  today: <path d="M3 11l9-7 9 7M5 10v10h14V10" />,
  checkin: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />,
  calendar: <path d="M3 10h18M8 3v4M16 3v4M6 5h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z" />,
  history: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
}

export default function Dashboard({ t, lang, username, onLogout }) {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)      
  const [loading, setLoading] = useState(false)    
  const [error, setError] = useState("")
  const [tab, setTab] = useState("today") 
       


  async function checkIn(event) {
    event.preventDefault()
    setLoading(true)
    setError("")
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, lang }),
    })
    const data = await response.json()
    setLoading(false)
    if (response.ok) {
      setResult(data)
    } else {
      setError(data.error)
    }
  }

  function startAgain() {
    setText("")
    setResult(null)
  }

  return (
    <main>
      <div className="hello">
        <h1>{t.hello}, {username}</h1>
        <button type="button" className="link-button small" onClick={onLogout}>{t.logOut}</button>
      </div>

      
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {Object.keys(t.tabs).map((name) => (
          <button key={name} type="button"
                    className={name === tab ? "nav-item active" : "nav-item"}
                    onClick={() => setTab(name)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[name]}
              </svg>
              {t.tabs[name]}
           </button>
          ))}
        </div>
      </nav>

      
      
      {tab === "today" && <Today t={t} onGo={setTab} />}

      {tab === "checkin" && (
        result === null ? (
          <form className="card" onSubmit={checkIn}>
            <h2>{t.mindTitle}</h2>
            <p className="muted small">{t.writeHint}</p>
            {error && <p className="error">{t.errors[error] || error}</p>}

            <textarea rows="4" value={text} placeholder={t.placeholder}
                      onChange={(e) => setText(e.target.value)} />

            <p className="muted small">{t.needStart}</p>
            <div className="starters">
              {t.starters.map((starter) => (
                <button key={starter} type="button" className="starter"
                        onClick={() => setText(starter + " ")}>
                  {starter}…
                </button>
              ))}
            </div>

            <button type="submit" className="big-button" disabled={loading}>
              {loading ? t.thinking : t.checkIn}
            </button>
          </form>
        ) : (
          <Results t={t} result={result} onDone={startAgain} />
        )
      )}

     
      {tab === "calendar" && <MoodCalendar t={t} />}
      {tab === "history" && <History t={t} />}
    </main>
  )
}