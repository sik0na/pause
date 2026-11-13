import { useState } from "react"
import { TEXTS } from "./texts.js"

export default function Settings({t, lang, onLanguage, theme, onTheme, loggedIn, onProfile, onLogout}) {
    const [open, setOpen] = useState(false)

    function choose(action) {
        action()
        setOpen(false)
    }

    return (
        <div className="settings">
            <button className="settings-button" type="button" aria-label={t.settings} aria-expanded={open} onClick={() => setOpen(!open)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />

                    <circle cx="15" cy="6" r="2"/>
                    <circle cx="9" cy="12" r="2"/>
                    <circle cx="17" cy="18" r="2"/>
                </svg>
            </button>
    
            {open && (
                <>
                    <div className="menu-backdrop" onClick={() => setOpen(false)}></div>
                    <div className="settings-menu">{loggedIn && (
                        <button className="menu-item" type="button" onClick={() => choose(onProfile)}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                            </svg>
                            {t.viewProfile}
                        </button>
                    )}
                    <p className="menu-label">{t.languageTitle}</p>
                    <div className="menu-languages">
                        {Object.keys(TEXTS).map((code) => (
                            <button className={code === lang ? "menu-language active" : "menu-language"} key={code} type="button" onClick={() => onLanguage(code)}>
                                {TEXTS[code].languageName}
                            </button>
                        ))}
                        </div>

                        <button className="menu-item" type="button" onClick={onTheme}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            aria-hidden="true">
                                {theme === "dark"
                                    ?  <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                                    : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                                }
                            </svg>
                            {theme === "dark" ? t.lightMode : t.darkMode}
                        </button>

                        {loggedIn && (
                            <button className="menu-item danger" type="button" onClick={() => choose(onLogout)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                                    <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
                                </svg>
                                {t.logOut}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    )   
}   