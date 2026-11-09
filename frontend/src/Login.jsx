import { useState } from "react";

export default function Login({ t, onLoggedIn }) {
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
            <form onSubmit={submit} className="card">
                <h1>{isLogin ? t.welcomeBack : t.createAccount}</h1>
                <p className="muted">{t.privateNote}</p>
                {error && <p className="error">{error}</p>}
                <label htmlFor="username">{t.username}</label>
                <input id="username" value={username} autoComplete="username" onChange={(e) => setUsername(e.target.value)}/>
                <label htmlFor="password">{t.password}</label>
                <input id="password" type="password" value={password} autoComplete={isLogin ? "current-password" : "new-password"} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">{isLogin ? t.logIn : t.signUp}</button>
                <p className="small">{isLogin ? t.newHere : t.haveAccount}{" "}
                    <button type="button" className="link-button" onClick={switchMode}>
                        {isLogin ? t.createLink : t.logIn}
                    </button>
                </p>
            </form>
        </main>
    )
}