

import { useState } from "react"
import Results from "./Results.jsx"
import History from "./History.jsx"


export default function Dashboard({ t, lang, username, onLogout }) {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)       
  const [loading, setLoading] = useState(false)   
  const [error, setError] = useState("")


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

        {result === null ? (
            <>
                <form onSubmit={checkIn} className="card">
                    <h2>{t.mindTitle}</h2>
                    <p className="muted small">{t.writeHint}</p>
                    {error && <p className="error">{error}</p>}

                    <textarea rows="4" value={text} placeholder={t.placeholder} onChange={(e) => setText(e.target.value)}/>
                    <p className="muted small">{t.needStart}</p>
                    <div className="starters">
                        {t.starters.map((starter) => (
                            <button className="starter" key={starter} type="button" onClick={() => setText(starter + "")}>
                                {starter}...
                            </button>
                        ))}
                    </div>

                    <button className="big-button" type="submit" disabled={loading}>
                        {loading ? t.thinking : t.checkIn}
                    </button>
                </form>
                <History t={t}/>
            </>
        ) : (
            <Results t={t} result={result} onDone={startAgain}/>
        )}
    </main>
  )
}
