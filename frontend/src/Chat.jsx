import { useEffect, useRef, useState } from "react";
import Breathing from "./Breathing.jsx"
import { EMOTIONS } from "./emotions.js";

const CALM_DOWN = ["fear", "anger", "sadness"]
const GOOD = ["joy", "surprise", "neutral"]

function Message({t, message}) {
    if (message.kind === "breathing") {
        return <Breathing t={t}/>

    }
    if (message.kind === "safety") {
        return (
            <div className="bubble bot safety-bubble">
                <strong>{message.title}</strong>
                <p>{message.text}</p>
            </div>
        )
    }

    if (message.kind === "emotion") {
        return (
            <div className="bubble bot">
                <span className="bubble-emotion">
                    <span className={"mood-dot mood-" + message.emotion}></span>
                    {t.youFeel} {t.emotions[message.emotion]}
                </span>
                <p>{message.text}</p>
            </div>
        )
    }

    if (message.kind === "tip") {
        return <div className="bubble bot tip-bubble">{message.text}</div>
    }
    return <div className={"bubble " + message.from}>{message.text}</div>
}

export default function Chat({ t, lang }) {
    const [messages, setMessages] = useState([])
    const [results, setResults] = useState([])
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState("chat")
    const [offerBreath, setOfferBreath] = useState(false)
    const [breathOffered, setBreathOffered] = useState(false)
    const [chosen, setChosen] = useState(null)
    const endRef = useRef(null)


    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth", block: "end"})
    }, [messages, loading])

    function add(...newMessages) {
        setMessages((old) => [...old, ...newMessages])
    }

    function pick(list) {
        return list[results.length % list.length]
    }

    async function send(event) {
        event.preventDefault()
        if (text.trim() === "" ||loading) {
            return
        }

        add({ from: "user", text: text})
        setText("")
        setOfferBreath(false)
        setLoading(true)

        const response = await fetch("/api/analyze", {
            method: "POST",
            headers: {"COntent-Type": "application/json"},
            body: JSON.stringify({ text, lang}),
        })
        const data = await response.json()
        setLoading(false)

        if(!response.ok) {
            add({ from: "bot", text: t.errors[data.error] || data.error})
            return
        }
        reply(data)
        setResults([...results, data])
    }

    function reply(data) {
        const emotion = data.emotion.emotion

        if(data.support.safety) {
            add ({ from: "bot", kind: "safety", title: data.support.safety.title, text: data.support.safety.text})
        }
        const words = data.text.split(" ").length
        if (!data.emotion.clear && words < 3) {
            add({ from: "bot", text: t.tellMore })
            return
        }

        const oldEmotions = results.filter((r) => r.emotion.clear).map((r => r.emotion.emotion))
        if (data.emotion.clear && !oldEmotions.includes(emotion)) {
            add({ from: "bot", kind: "emotion", emotion: emotion, text: data.support.choices[emotion]})

        } else {
            add({ from: "bot", text: pick(t.acks)})
        }
        const oldTopics = results.flatMap((r) => r.topics)
        data.topics.forEach((topic, index) => {
            if (!oldTopics.includes(topic)) {
                add ({ from: "bot", kind: "tip", text: data.support.tips[index]})
            }
        })

        if (data.emotion.clear && CALM_DOWN.includes(emotion) && ! breathOffered) {
            add ({ from: "bot", text: t.askBreath })
            setOfferBreath(true)
            setBreathOffered(true)

        } else {
            if (GOOD.includes(emotion)) {
                add({from: "bot", text: pick(t.followUps.good )})

            } else {
                add({ from: "bot", text: pick(t.followUps.hard )})
            }
        }
    }

    function breath(yes) {
        setOfferBreath(false)
        if (yes) {
            add({ from: "user", text: t.yes }, { from: "bot", kind: "breathing" })
        } else {
            add({ from: "user", text: t.notNow })
        }
        add({ from: "bot", text: t.anythingElse })
    }

    function endChat() {
        setOfferBreath(false)
        add({ from: "bot", text: t.endQuestion })
        setStep("mood")
    }

    function chooseMood(emotion) {
        setChosen(emotion)
        add({ from: "user", text: t.emotions[emotion]}, {from: "bot", text: t.askSave })
        setStep("save")
    }

    async function saveAnswer(yes) {
        if (yes) {
            add({ from: "user", text: t.save })
            const danger = results.find((r) => r.safety !== null)
            await fetch("/api/checkins", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: results.map((r) => r.text).join("\n"),
                    predicted: results[results.length - 1].emotion.emotion,
                    chosen: chosen,
                    topics: [...new Set(results.flatMap((r) => r.topics))],
                    safety: danger ? danger.safety : null,
                }),
            })
            add({ from: "bot", text: t.saved + " " + t.inHistory })
        } else {
            add({from: "user", text: t.dontSave }, { from: "bot", text: t.notSaved })
        }
        setStep("done")
    }

    function newChat() {
        setMessages([])
        setResults([])
        setOfferBreath(false)
        setBreathOffered(false)
        setChosen(null)
        setStep("chat")
    }

    return (
        <div className="chat">
            <div className="chat-messages">
                <div className="bubble bot">{t.chatHello}</div>
                {messages.map((message, index) => (
                    <Message key={index} t={t} message={message}/>
                ))}
                {loading && (
                    <div className="bubble bot typing" aria-label={t.thinking}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            {step === "chat" && (
                <>
                    {offerBreath && (
                        <div className="quick-replies">
                            <button className="secondary" type="button" onClick={() => breath(false)}>{t.notNow}</button>
                            <button type="button" onClick={() => breath(true)}>{t.yes}</button>
                        </div>
                    )}

                    {messages.length === 0 && (
                        <div className="starters">
                            {t.starters.map((starter) => (
                                <button key={starter} type="button" className="starter" onClick={() => setText(starter + " ")}>
                                    {starter}...
                                </button>
                            ))}
                        </div>

                    )}

                    <form onSubmit={send} className="chat-input">
                        <textarea rows="1" value={text} placeholder={t.placeholder} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                send(e)
                            }
                        }}/>
                        <button type="submit" aria-label={t.send} disabled={loading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                        </button>
                    </form>

                    {results.length > 0 && (
                        <button className="link-button small end-chat" type="button" onClick={endChat}>
                            {t.endChat}
                        </button>
                    )}
                </>
            )}

            {step === "mood" && (
                <div className="quick-replies">
                    {EMOTIONS.map((name) => 
                        <button key={name} type="button" className="choice" onClick={() => chooseMood(name)}>
                            <span className={"mood-dot mood-" + name}></span>
                            {t.emotions[name]}
                        </button>)}
                </div>

            )}

            {step === "save" && (
                <div className="quick-replies">
                    <button type="button" className="secondary" onClick={() => saveAnswer(false)}>{t.dontSave}</button>
                    <button type="button" onClick={() => saveAnswer(true)}>{t.save}</button>
                </div>
            )}
    

            {step === "done" && (
                <button type="button" className="big-button" onClick={newChat}>{t.newChat}</button>
            )}
        </div>
    )
    

}