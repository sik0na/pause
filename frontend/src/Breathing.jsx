import { useEffect, useState } from "react";

export default function Breathing({t}) {
    const [running, setRunning] = useState(false)
    const [breathingIn, setBreathingIn] = useState(true)

    useEffect(() => {
        if (!running) {
            return
        }
        setBreathingIn(true)
        const timer = setInterval(() => {
            setBreathingIn((value) => !value)
        }, 4000)
        return () => clearInterval(timer)
    }, [running])

    return (
        <div className="card center">
            <h2>{t.breathTitle}</h2>
            <p className="muted small">{t.breathHint}</p>

            <div className="breath-area">
                <div className={running ? "breath-circle running" : "breath-circle"}></div>
            </div>

            <p className="breath-label">
                {running ? (breathingIn ? t.breatheIn : t.breatheOut) : ""}
            </p>
            <button type="button" onClick={() => setRunning(!running)}>
                {running ? t.breathStop : t.breathStart}
            </button>
        </div>
    )
}