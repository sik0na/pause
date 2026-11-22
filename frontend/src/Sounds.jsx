import { useEffect, useRef, useState } from "react"

const SOUNDS = ["rain", "wind", "fire"]

function SoundSLider({name, label}) {
    const audioRef = useRef(null)
    const [volume, setVolume] = useState(0)

    useEffect(() => {
        const audio = audioRef.current
        audio.volume = volume

        if (volume > 0) {
            audio.play().catch(() => {})
        } else {
            audio.pause()
        }
    }, [volume])

    return (
        <label className="sound">
            <span>{label}</span>
            <input type="range" min="0" max="1" step="0.05"
            value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            <audio src={"/sounds/" + name + ".wav"} ref={audioRef} loop/>
        </label>
    )
}

export default function Sounds({ t }) {
    return (
        <div className="sounds">
            {SOUNDS.map((name) => (
                <SoundSLider key={name} name={name} label={t.soundNames[name]}/>
            ))}
        </div>
    )
}