'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import styles from './styles/footer.module.css'
import { TintedVector } from './mask_functions'
import Link from 'next/link'

// Matches the site's one existing responsive breakpoint (mirrors
// projects.tsx's own useIsMobile). Needed here (not just a CSS media query)
// because mobile wants a genuinely different link ORDER — Home, Projects,
// Experience, About Me, Education, Resume, interleaving the two desktop
// columns — not just a different visual arrangement of the same DOM, which a
// media query alone can't do across two separate flex containers.
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const mql = window.matchMedia('(max-width: 700px)')
        setIsMobile(mql.matches)
        const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [])
    return isMobile
}

export default function Footer() {
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const linkClassName = (href: string) => pathname === href ? styles.activeLink : undefined

    return (
        <footer className={styles.footer}>
            {/* maskSize is an explicit "Wpx Hpx" (not a single percentage) — a
                lone percentage only sets mask-size's width axis, leaving
                height as an implied "auto" that's supposed to derive from the
                vector's own aspect ratio; that implicit derivation isn't
                reliably honored for mask-image the way it is for a real
                background-image (same root cause as resume.tsx's background
                "zoom" bug — see its own comment). 490px is 50% of
                cow-blobs.svg's own NATURAL_SIZE (980x980.02, mask_functions.tsx)
                — i.e. half its original artwork size, not half of .footer or
                the viewport — so the tile stays a fixed physical size
                regardless of either of those. (The "misalignment" this used
                to get blamed on turned out to be unrelated to this tile size
                at all — see .footer's own z-index comment in footer.module.css
                for the real cause.) */}
            <TintedVector src="/masks/cow-blobs.svg" color='#F9F3EB' repeat="x" maskSize="600px 600px" className={styles.footerBackground}/>
            <div className={styles.centerSection}>
                <a href='mailto:amanda@danivan.com'>amanda@danivan.com</a>
                <p className={styles.externalLinks}><a href='https://github.com/17AlbinoZebras' target="_blank" rel="noopener noreferrer">GitHub</a> | <a href='https://www.linkedin.com/in/amanda-n-robinson/' target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            </div>
            {isMobile ? (
                // One flat list in a specific requested order (Home,
                // Projects, Experience, About Me, Education, Resume) —
                // desktop's own two-column left/right split doesn't map onto
                // that order, so this renders separately rather than
                // reordering the same two <div>s with CSS.
                <div className={styles.pageLinks}>
                    <p><Link href='/' className={linkClassName('/')}>Home</Link></p>
                    <p><Link href='/projects' className={linkClassName('/projects')}>Projects</Link></p>
                    <p><Link href='/experience' className={linkClassName('/experience')}>Experience</Link></p>
                    <p><Link href='/about' className={linkClassName('/about')}>About Me</Link></p>
                    <p><Link href='/education' className={linkClassName('/education')}>Education</Link></p>
                    <p><Link href='/resume' className={linkClassName('/resume')}>Resume</Link></p>
                </div>
            ) : (
                <div className={styles.pageLinks}>
                    <div className={styles.leftSection}>
                        <p><Link href='/' className={linkClassName('/')}>Home</Link></p>
                        <p><Link href='/about' className={linkClassName('/about')}>About Me</Link></p>
                        <p><Link href='/resume' className={linkClassName('/resume')}>Resume</Link></p>
                    </div>
                    <div className={styles.rightSection}>
                        <p><Link href='/projects' className={linkClassName('/projects')}>Projects</Link></p>
                        <p><Link href='/experience' className={linkClassName('/experience')}>Experience</Link></p>
                        <p><Link href='/education' className={linkClassName('/education')}>Education</Link></p>
                    </div>
                </div>
            )}
            <div className={styles.copyright}>
                <p>© Amanda N. Robinson 2026</p>
            </div>
        </footer>
    )
}