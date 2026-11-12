
import { useEffect, useState } from "react"
import { EMOTIONS } from "./emotions.js"
import MoodChart from "./MoodChart.jsx"

export default function MoodCalendar({ t }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())  

  
  const [checkins, setCheckins] = useState([])

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

  
  const monthText = dateOf(1).slice(0, 7)
  const monthCheckins = checkins.filter((checkin) => checkin.created_at.startsWith(monthText))

  
  function dayClass(day) {
    if (day === null) {
      return "day empty"
    }
    let name = "day"
    if (isToday(day)) {
      name += " today"
    }
    const mood = moods[dateOf(day)]
    if (mood) {
      name += " mood-" + mood
    }
    return name
  }

  return (
    <>
      <div className="card">
        <h2>{t.calendarTitle}</h2>

        <div className="month-bar">
          <button type="button" className="secondary" onClick={previousMonth} aria-label={t.previousMonth}>‹</button>
          <strong>{t.months[month]} {year}</strong>
          <button type="button" className="secondary" onClick={nextMonth} aria-label={t.nextMonth}>›</button>
        </div>

        <div className="calendar">
          {t.weekdays.map((name) => (
            <div key={name} className="weekday">{name}</div>
          ))}

          {cells.map((day, index) => (
            <div key={index} className={dayClass(day)}
                 title={day !== null && moods[dateOf(day)] ? t.emotions[moods[dateOf(day)]] : undefined}>
              {day}
            </div>
          ))}
        </div>

        <p className="muted small">{t.calendarHint}</p>
        <div className="legend">
          {EMOTIONS.map((name) => (
            <span key={name} className="legend-item">
              <span className={"legend-dot mood-" + name}></span>
              {t.emotions[name]}
            </span>
          ))}
        </div>
      </div>

      <MoodChart t={t} checkins={monthCheckins} />
    </>
  )
}