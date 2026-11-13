import { useState } from "react"
import Breathing from "./Breathing.jsx"

export default function Results({ t, result, onDone }) {
    const [chosen, setChosen] = useState(result.emotion.clear ? result.emotion.emotion : null)
    const [saved, setSaved] = useState(false)

    const support = result.support

    async function save() {
        await fetch("/api/checkins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                text: result.text,
                predicted: result.emotion.emotion,
                chosen: chosen,
                topics: result.topics,
                safety: result.safety,
            }),
        })
        setSaved(true)
    }

    return (
        <>
            {support.safety && (
                <div className="card safety">
                    <h2>{support.safety.title}</h2>
                    <p>{support.safety.text}</p>
                </div>
            )}

            {chosen === null ? (
                <div className="card">
                    <h2>{t.whichFits}</h2>
                    <p className="muted">{support.message}</p>
                    <div className="choices">{result.emotion.top3.map((pair) =>
                        <button key={pair[0]} type="button" className="choice" onClick={() => setChosen(pair[0])}>
                            <span className={"mood-dot mood-" + pair[0]}></span>
                            {t.emotions[pair[0]]}
                        </button>
                    )}</div>
                </div>
            ) : (
                <div className="result-header">
                    <div className={"result-circle mood-" + chosen}></div>
                    <p className="result-label">{t.youFeel}</p>
                    <h1 className="result-emotion">{t.emotions[chosen]}</h1>
                    <p>{support.choices[chosen]}</p>
                    {result.topics.length > 0 && (
                        <div className="topic-chips">
                            {result.topics.map((topic) => (
                                <span key={topic} className="topic-chip">{t.topics[topic]}</span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {chosen !== null && support.tips.length > 0 && (
                <>
                    <h2 className="section-title">{t.tipsTitle}</h2>
                    <div className="tip-list">
                        {support.tips.map((tip, index) => (
                            <div key={tip} className="tip-card">
                                <span className={"tip-icon tip-color-" + (index % 3)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2"
                                         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z" />
                                    </svg>
                                </span>
                                <p>{tip}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {["fear", "anger", "sadness"].includes(chosen) && <Breathing t={t} />}

            {chosen !== null && (
                <div className="card save-card">
                    {saved ? (
                        <>
                            <p className="center"><strong>{t.saved}</strong> {t.inHistory}</p>
                            <button className="big-button" type="button" onClick={onDone}>{t.writeAnother}</button>
                        </>
                    ) : (
                        <>
                            <h2>{t.saveTitle}</h2>
                            <p className="muted small">{t.onlyYou}</p>
                            <div className="save-buttons">
                                <button className="secondary" onClick={onDone} type="button">{t.dontSave}</button>
                                <button type="button" className="save-main" onClick={save}>{t.save}</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}