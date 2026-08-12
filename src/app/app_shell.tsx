'use client'
import React, { createContext, useLayoutEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

import styles from './styles/page.module.css'
import { AllSliders } from './sliders'
import Footer from './footer'

export interface AppStateTypes {
    neverHovered: boolean,
    setNeverHovered: (v: boolean) => void;
}

// Whether the home page's intro (sliders fade-in, orb fly-out-and-return)
// should play — true only the very first time a session arrives at "/", never
// again on later return visits. Consumed by home_page.tsx via useContext,
// since {children} is opaque and can't otherwise receive a prop from here.
export const AppIntroContext = createContext(false)

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [neverHovered, setNeverHovered] = useState(true)
    const pathname = usePathname()

    const appState: AppStateTypes = {
        neverHovered,
        setNeverHovered
    }

    // hasShownIntroRef tracks "ever shown, this session" without triggering a
    // re-render itself. playIntro is the per-visit decision, updated only
    // when pathname actually changes (not on every re-render — e.g.
    // neverHovered flipping on hover — which would otherwise yank the intro
    // classes off mid-animation the moment anything else here re-renders).
    // useLayoutEffect (not useEffect) so the very first home page load
    // doesn't flash the settled look for a frame before jumping to the
    // intro's starting position.
    //
    // lastPathnameRef guards against React's dev-only Strict Mode, which
    // double-invokes an effect on a component's initial mount (mount →
    // simulated cleanup → mount again) without resetting refs in between.
    // Without this guard, that second invocation would see
    // hasShownIntroRef.current already flipped true by the first one and
    // immediately re-decide playIntro back to false, so the intro would
    // silently never play. Skipping a second invocation for a pathname
    // that hasn't actually changed makes the effect idempotent against that
    // replay while still reacting normally to real navigation.
    const hasShownIntroRef = useRef(false)
    const lastPathnameRef = useRef<string | null>(null)
    const [playIntro, setPlayIntro] = useState(false)

    useLayoutEffect(() => {
        if (lastPathnameRef.current === pathname) return
        lastPathnameRef.current = pathname

        if (pathname === '/' && !hasShownIntroRef.current) {
            setPlayIntro(true)
            hasShownIntroRef.current = true
        } else {
            setPlayIntro(false)
        }
    }, [pathname])

    return (
        <div className={styles.page}>
            <main className={styles.main}>
            <AppIntroContext.Provider value={playIntro}>
                {children}
            </AppIntroContext.Provider>
            <div className={playIntro ? styles.sliderFadeIn : undefined}>
                <AllSliders appState={appState}/>
            </div>
            <Footer/>
            </main>
        </div>
    )
}
