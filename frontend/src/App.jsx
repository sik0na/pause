import { useEffect, useState } from "react";

export default function App() {
  const [me, setMe] = useState(null)

  useEffect(()=> {
    fetch("/api/me")
    .then((response) => response.json())
    .then((data) => setMe(data))
  }, [])

   return (
    <main>
      <div className="card">
        <h1>Pause</h1>
        {me === null
          ? <p>Loading…</p>
          : <p>The backend says: logged in = <strong>{String(me.logged_in)}</strong></p>}
      </div>
    </main>
  )
}