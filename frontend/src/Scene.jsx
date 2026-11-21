function clamp(x) {
    return Math.min(1, Math.max(0, x))

}

export default function Scene({ name, progress }) {
    const sunset = clamp((progress - 0.4) / 0.3)
    const night = clamp((progress - 0.7) / 0.25)
    const folder = "/scenes/" + name + "/"

    return (
        <div className="scene">
            <img src={folder + "day.png"} alt="" />
            <img src={folder + "sunset.png"} alt="" style={{ opacity: sunset}}/>
            <img src={folder + "night.png"} alt="" style={{ opacity: night}}/>
        </div>
    )
}