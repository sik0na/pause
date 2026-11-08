// Dashboard.jsx - Step 14: the student's home page with the "What's on your mind?" card.

import { useState } from "react"

// Ideas to help the student start writing (they finish the sentence)
const STARTERS = [
  "Exams are coming up and",
  "I didn't sleep well because",
  "Today was actually good because",
  "I miss home because",
]

export default function Dashboard({ username, onLogout }) {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)       // the AI's answer (null = nothing yet)
  const [loading, setLoading] = useState(false)    // true while the AI is thinking
  const [error, setError] = useState("")

  // Send the text to our AI (the backend's /api/analyze)
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
      setError(data.error)        // e.g. "Please write a few words."
    }
  }

  // Back to an empty writing card
  function startAgain() {
    setText("")
    setResult(null)
  }

  return (
    <main>
      <div className="hello">
        <h1>Hi, {username} 👋</h1>
        <button type="button" className="link-button small" onClick={onLogout}>Log out</button>
      </div>

      {result === null ? (
        // No answer yet: show the writing card
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
            {loading ? "Thinking…" : "Check in ✨"}
          </button>
        </form>
      ) : (
        // The AI answered: a simple result for now (the full results page is Step 15)
        <div className="card">
          <h2>Your check-in</h2>
          <p>Emotion: <strong>{result.emotion.emotion}</strong> ({Math.round(result.emotion.confidence * 100)}%)</p>
          <p>Topics: {result.topics.length > 0 ? result.topics.join(", ") : "none"}</p>
          <p>{result.support.message}</p>
          <button type="button" className="secondary" onClick={startAgain}>Write another</button>
        </div>
      )}
    </main>
  )
}
