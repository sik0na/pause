import { useState } from "react";

export default function MoodCalendar({t}) {
    const today = new Date()
    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth())

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
                    <div key={index} className={day === null ? "day empty" : isToday(day) ? "day today" : "day"}>
                        {day}
                    </div>
                ))}
            </div>
        </div>
    )
}