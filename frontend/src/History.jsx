import { useEffect, useState } from "react";
import {EMOJIS} from "./emojis.js"

export default function History( {t}) {
    const [checkins, setCheckins] = useState(null)

    useEffect(() => {
        fetch("/api/checkins")
            .then((response) => response.json())
            .then((data) => setCheckins(data.checkins))
    }, [])

    async function deleteCheckin(id) {
      if (!window.confirm(t.deleteConfirm)) {
        return
      }

      const response = await fetch("/api/checkins" + id, {method: "DELETE"})
      if (response.ok) {
        setCheckins(checkins.filter((checkin) => checkin.id != id))
      }
    }

    if (checkins === null) {
        return <p className="muted center">{t.historyLoading}</p>
    }

    return (
    <div className="card">
      <h2>{t.historyTitle}</h2>
      {checkins.length === 0 && <p className="muted">{t.noCheckins}</p>}

      <ul className="history">
        {checkins.map((checkin) => (
          <li key={checkin.id}>
            <span className="history-emoji">{EMOJIS[checkin.chosen]}</span>
            <div>
              <p className="history-text">{checkin.text}</p>
              <p className="muted small">
                {checkin.created_at} · {t.emotions[checkin.chosen]}
                {checkin.topics.length > 0 && " · " + checkin.topics.map((topic) => t.topics[topic]).join(", ")}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}