import { useEffect, useState } from "react";
import Breathing from "./Breathing";

function dateText(date) {
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    return date.getFullYear() + "-" + mm + "-" + dd
}

export default function Today({t, onGo}) {
    const [checkins, setCheckins] = useState([])
    const [showBreath, setShowBreath] = useState(false)
    useEffect(() => {
        fetch("/api/checkins")
            .then((response) => response.json())
            .then((data) => setCheckins(data.checkins))
    }, [])
    const moods = {}
    for (const checkin of checkins) {
        const date = checkin.created_at.slice(0, 10)
        if (!(date in moods)) {
            moods[date] = checkin.chosen
        }
    }
    const today = new Date()
    const weekdayIndex = (today.getDay() + 6) % 7
    const week = []
    for (let i = 0; i < 7; i++) {
        week.push(new Date(today.getFullYear(), today.getMonth(), today.getDate() - weekdayIndex + i))
    }
    const todayMood = moods[dateText(today)]
    function circleClass(date) {
        let name = "week-circle"
        const mood = moods[dateText(date)]
        if (mood) {
            name += " mood-" + mood
        }
        if (dateText(date) === dateText(today)) {
            name += " today"
        }
        return name
    }
    return (
        <div className="today-page">
            <p className="muted small">
                {t.weekdays[weekdayIndex]}, {today.getDate()} {t.months[today.getMonth()]}
            </p>
            <div className="week">
                {week.map((date, index) => (
                    <div className="week-day" key={index}>{t.weekdays[index]}
                        <span className={circleClass(date)}>{date.getDate()}</span>
                    </div>
                ))}
            </div>
            <div className="today-circle">
                <p className="muted">{t.todayQuestion}</p> {todayMood ? (
                    <>
                        <span className={"today-mood mood-" + todayMood}></span>
                        <strong>{t.emotions[todayMood]}</strong>
                    </>
                ) : (
                    <strong>{t.noCheckinYet}</strong>
                )}
                <button type="button" onClick={() => onGo("checkin")}>
                    {todayMood ? t.checkInAgain : t.checkIn}
                </button>
            </div>
            <h2>{t.forYou}</h2>
            <div className="for-you">
                <button type="button" className="for-you-card lavender" onClick={() => setShowBreath(!showBreath)}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6342ea" strokeWidth="2" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" />
                    </svg>
                    {t.cardBreath}
                </button>
                <button type="button" className="for-you-card peach" onClick={() => onGo("calendar")}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a8461a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />
                    </svg>
                    {t.cardCalendar}
                </button>
                <button type="button" className="for-you-card pink" onClick={() => onGo("history")}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b02a43" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                    {t.cardHistory}
                </button>
            </div>
            {showBreath && <Breathing t={t}/>}
        </div>
    )
}
