import { useEffect, useRef } from "react";

const WIDTH = 192
const HEIGHT = 108

export default function Weather({ type }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (type === "clear") return

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        const drops = []

        for (let i = 0; i < 80; i++) {
            drops.push({
                x: Math.random() * WIDTH,
                y: Math.random() * HEIGHT,
                speed: type === "rain" ? 2 + Math.random() * 2 : 0.3 + Math.random() * 0.4,
            })
        }

        let frame 

        function draw() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT)

            drops.forEach((drop) => {
                if (type === "rain") {
                    ctx.fillStyle = "rgba(170, 200, 255, 0.7)"
                    ctx.fillRect(Math.floor(drop.x), Math.floor(drop.y), 1, 3)
                } else {
                    ctx.fillStyle = "white"
                    ctx.fillRect(Math.floor(drop.x), Math.floor(drop.y), 1, 1)

                    drop.x += Math.sin(drop.y / 10) * 0.2
                }

                drop.y += drop.speed
                if (drop.y > HEIGHT) {
                    drop.y = -3
                    drop.x = Math.random() * WIDTH
                }
            })

            frame = requestAnimationFrame(draw)
        }
        draw()

        return () => {
            cancelAnimationFrame(frame)
            ctx.clearRect(0, 0, WIDTH, HEIGHT)
        }
    }, [type])

    return <canvas ref={canvasRef} className="weather" width={WIDTH} height={HEIGHT}/>
}