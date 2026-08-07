'use client'
import React, { useEffect, useMemo, useState } from 'react'

import styles from './styles/home_page.module.css'
import { clipToShape, TintedVector } from './mask_functions'
import { sliderColors, GreenOrb, RedOrb, YellowOrb, BlueOrb, RedSliderRect, RedSlider, YellowSlider, GreenSlider, BlueSlider } from './sliders'

export default function HomePage() {


    return (
        <div className={styles.home}>
            <div className={styles.orbs}>
                <div className={styles.redOrb}>
                    <RedOrb size='275px' style={{ filter: `drop-shadow(-6px -5px ${sliderColors.red.outline}` }} />
                </div>
                <div className={styles.yellowOrb}>
                    <YellowOrb size='425px' style={{ filter: `drop-shadow(6px -4px ${sliderColors.yellow.outline}` }} />
                </div>
                <div className={styles.greenOrb}>
                    <GreenOrb size='350px' style={{ filter: `drop-shadow(-7px 4px ${sliderColors.green.outline}` }} />
                </div>
                <div className={styles.blueOrb}>
                    <BlueOrb size='300px' style={{ filter: `drop-shadow(4px 6px ${sliderColors.blue.outline}` }} />
                </div>
            </div>
            <GreenSlider width="400px" height="187.5px" />
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
                <div className={styles.subtitleSection}>
                    <span className={styles.subtitle}>I sure do code.<br/>Lorem ipsum, Etc.</span>
                </div>
            </div>
        </div>
    )
}