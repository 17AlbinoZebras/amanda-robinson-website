'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'

import styles from './styles/page.module.css'
import { AllSliders } from './sliders'
import Footer from './footer'

export interface AppStateTypes {
    neverHovered: boolean,
    setNeverHovered: (v: boolean) => void;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
    const [neverHovered, setNeverHovered] = useState(true)
    const pathname = usePathname()

    const appState: AppStateTypes = {
        neverHovered,
        setNeverHovered
    }

    // The sliders' fade-in-after-load treatment is a "grand entrance" for
    // arriving at the site, not something that should replay every time this
    // shell mounts on a different route — so it only applies on the home page.
    const isHomePage = pathname === '/'

    return (
        <div className={styles.page}>
            <main className={styles.main}>
            {children}
            <div className={isHomePage ? styles.sliderFadeIn : undefined}>
                <AllSliders appState={appState}/>
            </div>
            <Footer/>
            </main>
        </div>
    )
}
