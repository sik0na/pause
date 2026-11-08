

import { useState } from "react"
import Results from "./Results.jsx"

const STARTERS = [
  "Exams are coming up and",
  "I didn't sleep well because",
  "Today was actually good because",
  "I miss home because",
]

export default function Dashboard({ username, onLogout }) {
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
      body: JSON.stringify({ text }),
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
        <h1>Hi, {username} </h1>
        <button type="button" className="link-button small" onClick={onLogout}>Log out</button>
      </div>

      {result === null ? (
        <form className="card" onSubmit={checkIn}>
          <h2>What's on your mind?</h2>
          <p className="muted small">Write it the way you'd text a friend. Only you can see this.</p>
          {error && <p className="error">{error}</p>}

          <textarea rows="4" value={text} placeholder="e.g. I'm worried about my exams"
                    onChange={(e) => setText(e.target.value)} />

          <p className="muted small">Need a starting point?</p>
          <div className="starters">
            {STARTERS.map((starter) => (
              <button key={starter} type="button" className="starter" onClick={() => setText(starter + " ")}>
                {starter}…
              </button>
            ))}
          </div>

          <button type="submit" className="big-button" disabled={loading}>
            {loading ? "Thinking…" : "Check in"}
          </button>
        </form>
      ) : (
       
        <Results result={result} onDone={startAgain} />
        
      )}
    </main>
  )
}
