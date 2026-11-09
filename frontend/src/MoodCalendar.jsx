import { useState, useEffect } from "react";
import { EMOJIS } from "./emojis.js" 
export default function MoodCalendar({t}) {
    const today = new Date()
    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth())

    const [moods, setMoods] = useState({})

    useEffect(() => {
        fetch("/api/checkins")
            .then((response) => response.json())
            .then((data) => {
                const byDay = {}
                for (const checkin of data.checkins) {
                    const date = checkin.created_at.slice(0, 10)
                    if (!(date in byDay)) {
                        byDay[date] = checkin.chosen
                    }
                }
                setMoods(byDay)
            })
    }, [])

    function previousMonth() {
        if (month === 0) {
            setMonth(11)
            setYear(year - 1)
        } else {
            setMonth(month - 1)
        }
    }

    function nextMonth() {
        if (month === 11) {
            setMonth(0)
            setYear(year + 1)
        } else {
            setMonth(month + 1)
        }
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7

    const cells = []
    for (let i = 0; i < firstWeekday; i++) {
        cells.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(day)
    }

    function isToday(day) {
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    }

    function dateOf(day) {
        const mm = String(month + 1).padStart(2, "0")
        const dd = String(day).padStart(2, "0")
        return year + "-" + mm + "-" + dd
    }

    function dayClass(day) {
        if (day === null) {
            return "day empty"
        }

        let name = "day"
        if (isToday(day)){
            name += " today"
        }

        const mood = moods[dateOf(day)]
        if(mood) {
            name += " mood-" + mood
        }
        return name
    }

    return (
        <div className = "card">
            <h2>{t.calendarTitle}</h2>

            <div className="month-bar">
                <button className="secondary" type="button" onClick={previousMonth} aria-label={t.previousMonth}>‹</button>
                <strong>{t.months[month]} {year}</strong>
                <button className="secondary" type="button" onClick={nextMonth} aria-label={t.nextMonth}>›</button>
            </div>

            <div className="calendar">
                {t.weekdays.map((name) => (
                    <div key={name} className="weekday">
                        {name}
                    </div>
                ))}
                {cells.map((day, index) => (
                    <div key={index} className={dayClass(day)} title={day !== null && moods[dateOf(day)] ? t.emotions[moods[dateOf(day)]] : undefined}>
                        {day}
                    </div>
                ))}
            </div>

            <p className="muted small">{t.calendarHint}</p>
            <div className="legend"></div>
                {Object.keys(EMOJIS).map((name) => (
                    <span key={name} className="legend-item">
                        <span className={"legend-dot mood-" + name}></span>
                {t.emotions[name]}</span>
                ))}
        </div>
    )
}