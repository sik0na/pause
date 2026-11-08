import { useEffect, useState } from "react";
import {EMOJIS} from "./emojis.js"

export default function History() {
    const [checkins, setCheckins] = useState(null)

    useEffect(() => {
        fetch("/api/checkins")
            .then((response) => response.json())
            .then((data) => setCheckins(data.checkins))
    }, [])

    if (checkins === null) {
        return <p className="muted center">Loading your history...</p>
    }

    return (
    <div className="card">
      <h2>Your history</h2>
      {checkins.length === 0 && <p className="muted">No check-ins yet. Your saved check-ins will appear here.</p>}

      <ul className="history">
        {checkins.map((checkin) => (
          <li key={checkin.id}>
            <span className="history-emoji">{EMOJIS[checkin.chosen]}</span>
            <div>
              <p className="history-text">{checkin.text}</p>
              <p className="muted small">
                {checkin.created_at} · {checkin.chosen}
                {checkin.topics.length > 0 && " · " + checkin.topics.join(", ")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}