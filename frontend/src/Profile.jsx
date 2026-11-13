import { useEffect, useState } from "react"
import { EMOTIONS } from "./emotions.js"

export default function Profile({t, username}) {
    const [checkins, setCheckins] = useState([])

    useEffect(() => {
        fetch("/api/checkins") 
            .then((response) => response.json())
            .then((data) => setCheckins(data.checkins))

    }, [])

    const days = new Set(checkins.map((checkin) => checkin.created_at.slice(0, 10)))
    const counts = {}
    for (const checkin of checkins) {
        counts[checkin.chosen] = (counts[checkin.chosen] || 0) + 1
    }

    let topMood = null
    for (const name of EMOTIONS) {
        if (counts[name] && (topMood === null || counts[name] > counts[topMood])) {
            topMood = name
        }
    }

    const firstDate = checkins.length > 0 ? checkins[checkins.length - 1].created_at.slice(0, 10) : null

    return (
        <div className="profile">
            <div className="profile-header">
                <div className="avatar">
                    {username[0].toUpperCase()}
                </div>

                <h1>{username}</h1>
                <p className="muted small">{t.privateNote}</p>
            </div>

            <div className="stats">
                <div className="stat">
                    <strong>{checkins.length}</strong>
                    <span>{t.totalCheckins}</span>
                </div>
                <div className="stat">
                    <strong>{days.size}</strong>
                    <span>{t.daysCheckedIn}</span>
                </div>
            </div>

            <div className="card">
                <div className="profile-row">
                    <span className="muted">{t.mostCommonMood}</span>
                    {topMood ? (
                        <span className="profile-mood">
                            <span className={"mood-dot mood-" + topMood}></span>
                            {t.emotions[topMood]}
                        </span>
                    ): (
                        <strong>-</strong>
                    )}
                </div>
                <div className="profile-row">
                    <span className="muted">{t.firstCheckin}</span>
                    <strong>{firstDate || "-"}</strong>
                </div>
            </div>
        </div>
    )
}