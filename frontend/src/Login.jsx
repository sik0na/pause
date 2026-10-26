import { useState } from "react";

export default function Login({ onLoggedIn }) {
    const [mode, setMode] = useState("login")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    
    const isLogin = mode === "login"

    async function submit(event) {
        event.preventDefault()
        const response = await fetch(isLogin ? "/api/login" : "/api/signup",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
        const data = await response.json()
        if (response.ok) {
            onLoggedIn(data.username)
        }else{
            setError(data.error)
        }
    }

    function switchMode() {
        setMode(isLogin ? "signup" : "login")
        setError("")
    }

    return (
        <main>
            <form className="card" onSubmit={submit}>
                <h1>{isLogin ? "Welcome back" : "Create your account"}</h1>
                <p className="muted">Your check-ins are private to your account.</p>
                {error && <p className="error">{error}</p>}
                <label htmlFor="username">Username</label>
                <input id="username" value={username} autoComplete="username" onChange={(e)=> setUsername(e.target.value)}/>
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} autoComplete={isLogin ? "current-password" : "new-password"}
                    onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">{isLogin ? "Log in" : "Sign up"}</button>
                <p className="small">{isLogin ? "New here?" : "Already have an account?"}{" "}
                    <button type="button" className="link-button" onClick={switchMode}>{isLogin ? "Create an account" : "Log in"}</button>
                </p>
            </form>
        </main>
    )
}