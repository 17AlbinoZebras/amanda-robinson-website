'use client'
import React, { useEffect, useState } from 'react'

import styles from './styles/footer.module.css'
import { TintedVector } from './mask_functions'
import Link from 'next/link'

export default function Footer() {
    return (
        <div className={styles.footer}>
            <TintedVector src="/masks/cow-blobs.svg" color='#F9F3EB' repeat="x" maskSize="50%" className={styles.footerBackground}/>
            <div className={styles.centerSection}>
                <a href='mailto:amanda@danivan.com'>amanda@danivan.com</a>
                <p className={styles.externalLinks}><a href='https://github.com/17AlbinoZebras'>GitHub</a> | <a href='https://www.linkedin.com/in/amanda-n-robinson/'>LinkedIn</a></p>
            </div>
            <div className={styles.pageLinks}>
                <div className={styles.leftSection}>
                    <Link as='/home' href='/home_page'>Home</Link>
                    <br/>
                    <Link as='/about' href='/about'> About Me</Link>
                </div>
                <div className={styles.rightSection}>
                    <Link as='/projects' href='/projects'></Link>
                    <a>Projects</a>
                    <br/>
                    <a>Experience</a>
                    <br/>
                    <a>Education</a>
                </div>
            </div>
            <div className={styles.copyright}>
                <span>© Amanda N. Robinson 2026</span>
            </div>
        </div>
    )
}