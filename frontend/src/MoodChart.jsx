import { EMOTIONS } from "./emotions"


export default function MoodChart({t, checkins}) {
    const counts = {}
    for (const name of EMOTIONS) {
        counts[name] = 0
    }
    for (const checkin of checkins) {
        counts[checkin.chosen] += 1
    }

    const biggest = Math.max(...Object.values(counts))

    const names = Object.keys(counts).sort((a, b) => counts[b] - counts[a])

    return (
        <div className="card">
            <h2>{t.chartTitle}</h2>
            {checkins.length === 0 ? (
                <p className="muted">{t.chartEmpty}</p>
            ) : (
                <div className="chart">
                    {names.map((name) => (
                    <div key={name} className="bar-row">
                        <span className="bar-label">
                            <span className={"mood-dot mood-" + name}></span>
                            {t.emotions[name]}
                            </span>
                    <div className="bar-track">
                    <div className={"bar mood-" + name}
                        style={{ width: (counts[name] / biggest) * 100 + "%" }}></div>
                    </div>
                    <span className="bar-count">{counts[name]}</span>
                </div>
            ))}
            </div>
            )}
        </div>
    )
}