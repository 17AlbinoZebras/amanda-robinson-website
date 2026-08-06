'use client'
import React, { useEffect, useMemo, useState } from 'react'

import styles from './styles/home_page.module.css'
import { clipToShape, TintedVector } from './mask_functions'

export default function HomePage() {


    return (
        <div className={styles.home}>
            <div className={styles.mainText}>
                <div className={styles.nameSection}>
                    <div className={styles.blobMask}>
                        <TintedVector
                            src="/masks/Blob.svg"
                            color="#FFB2B3"
                            width={"75%"}
                            style={{opacity: "80%"}}
                        />
                    </div>
                    <svg
                        className={styles.nameStack}
                        viewBox="0 0 900 300"
                        role="img"
                        aria-label="Amanda Robinson"
                    >
                        <text x="50%" y="128" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Amanda</text>
                        <text x="50%" y="272" textAnchor="middle" className={styles.svgNameText} fill="#5B5F97" stroke="#F5DFB4" strokeWidth="4">Robinson</text>
                    </svg>
                </div>
            </div>
        </div>
    )
}