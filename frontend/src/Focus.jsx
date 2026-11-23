import { useEffect, useState } from "react"
import Scene from "./Scene.jsx"
import Sounds from "./Sounds.jsx"
import Tasks from "./Tasks.jsx"

const SCENES = ["room", "lake", "city"]
const WEATHERS = ["clear", "rain", "snow"]
const MODES = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

function playChime() {
  const audio = new AudioContext()
  const notes = [784, 988, 1319]
  notes.forEach((freq, i) => {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    osc.type = "square"
    osc.frequency.value = freq
    gain.gain.value = 0.08
    osc.connect(gain)
    gain.connect(audio.destination)
    const at = audio.currentTime + i * 0.15
    osc.start(at)
    osc.stop(at + 0.12)
  })
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return String(minutes).padStart(2, "0") + ":" + String(rest).padStart(2, "0")
}

export default function Focus({ t }) {
  const [mode, setMode] = useState("focus")
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus)
  const [endTime, setEndTime] = useState(null)
  const [rounds, setRounds] = useState(0)
  const [scene, setScene] = useState("room")
  const [weather, setWeather] = useState("clear")

  const progress = mode === "focus" ? 1 - secondsLeft / MODES.focus : 1
  const running = endTime !== null

  useEffect(() => {
    if (endTime === null) return

    const timer = setInterval(() => {
      const left = Math.ceil((endTime - Date.now()) / 1000)

      if (left <= 0) {
        playChime()
        if (mode === "focus") {
          const newRounds = rounds + 1
          setRounds(newRounds)
          switchMode(newRounds % 4 === 0 ? "long" : "short")
        } else {
          switchMode("focus")
        }
      } else {
        setSecondsLeft(left)
      }
    }, 250)

    return () => clearInterval(timer)
  }, [endTime, mode, rounds])

  function start() {
    setEndTime(Date.now() + secondsLeft * 1000)
  }

  function pause() {
    setEndTime(null)
  }

  function switchMode(newMode) {
    setMode(newMode)
    setEndTime(null)
    setSecondsLeft(MODES[newMode])
  }

  function reset() {
    switchMode(mode)
  }

    return (
    <>
      <Scene name={scene} progress={progress} weather={weather} />

      <div className="focus-layout">
        <section className="panel timer-panel">
          <h2>{t.focusTitle}</h2>

          <div className="timer-modes">
            {Object.keys(MODES).map((name) => (
              <button key={name} type="button"
                      className={name === mode ? "timer-mode active" : "timer-mode"}
                      onClick={() => switchMode(name)}>
                {t.timerModes[name]}
              </button>
            ))}
          </div>

          <p className="timer-digits">{formatTime(secondsLeft)}</p>

          <div className="timer-buttons">
            {running
              ? <button type="button" onClick={pause}>{t.timerPause}</button>
              : <button type="button" onClick={start}>{t.timerStart}</button>}
            <button type="button" className="secondary" onClick={reset}>{t.timerReset}</button>
          </div>

          <div className="timer-dots">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={i < rounds % 4 ? "timer-dot done" : "timer-dot"}></span>
            ))}
          </div>
        </section>

        <aside className="focus-side">
          <section className="panel">
            <h3>{t.sceneTitle}</h3>
            <div className="timer-modes">
              {SCENES.map((name) => (
                <button key={name} type="button"
                        className={name === scene ? "timer-mode active" : "timer-mode"}
                        onClick={() => setScene(name)}>
                  {t.sceneNames[name]}
                </button>
              ))}
            </div>
            <div className="timer-modes">
              {WEATHERS.map((name) => (
                <button key={name} type="button"
                        className={name === weather ? "timer-mode active" : "timer-mode"}
                        onClick={() => setWeather(name)}>
                  {t.weatherNames[name]}
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <h3>{t.soundsTitle}</h3>
            <Sounds t={t} />
          </section>

          <section className="panel">
            <Tasks t={t} />
          </section>
        </aside>
      </div>
    </>
  )
}