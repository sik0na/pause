import { useState } from "react"
import { EMOJIS } from "./emojis.js"

export default function Results({result, onDone}) {
    const [chosen, setChosen] = useState(result.emotion.clear ? result.emotion.emotion : null)
    const [saved, setSaved] = useState(false)

    const support = result.support

    async function save() {
        await fetch("/api/checkins", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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

            <div className="card">
                {chosen === null ? (
                    <>
                        <h2>Which of these fits best?</h2>
                        <p className="muted">{support.message}</p>
                        <div className="choices">{result.emotion.top3.map((pair) => 
                            <button key={pair[0]} type="button" className="choice" onClick={() => setChosen(pair[0])}>
                                {EMOJIS[pair[0]]} {pair[0]}
                            </button>
                        )}</div>
                    </>
                ) : (
                    <>
                        <div className="big-emoji">{EMOJIS[chosen]}</div>
                        <h2 className="center">You seem to feel <span className="emotion-name">{chosen}</span></h2>
                        <p>{support.choices[chosen]}</p>
                    </>
                )}
            </div>

            {chosen !== null && support.tips.length > 0 && (
                <div className="card">
                    <h2>Tips for you</h2>
                    <ul className="tips">
                        {support.tips.map((tip) => (
                            <li key={tip}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}

            {chosen !== null && (
                <div className="card">
                    {saved ? (
                        <>
                            <p className="center"><strong>Saved</strong> You can see it in your history.</p>
                            <button className="big-button" type="button" onClick={onDone}>Write another</button>
                        </>
                    ) : (
                        <>
                            <h2>Save this check-in?</h2>
                            <p className="muted small"> Only you can see your check-ins.</p>
                            <div className="row">
                                <button type="button" onClick={save}>Save</button>
                                <button className="secondary" onClick={onDone} type="button">Don't save</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    )
}