'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import styles from './styles/footer.module.css'
import { TintedVector } from './mask_functions'
import Link from 'next/link'

export default function Footer() {
    const pathname = usePathname()
    const linkClassName = (href: string) => pathname === href ? styles.activeLink : undefined

    return (
        <div className={styles.footer}>
            <TintedVector src="/masks/cow-blobs.svg" color='#F9F3EB' repeat="x" maskSize="50%" className={styles.footerBackground}/>
            <div className={styles.centerSection}>
                <a href='mailto:amanda@danivan.com'>amanda@danivan.com</a>
                <p className={styles.externalLinks}><a href='https://github.com/17AlbinoZebras' target="_blank" rel="noopener noreferrer">GitHub</a> | <a href='https://www.linkedin.com/in/amanda-n-robinson/' target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
            </div>
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
            <div className={styles.copyright}>
                <p>© Amanda N. Robinson 2026</p>
            </div>
        </div>
    )
}