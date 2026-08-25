import React from 'react'

import styles from './styles/resume.module.css'
import { TintedVector } from './mask_functions'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'

export default function Resume() {
    return (
        <div className={styles.page}>
            <TintedVector src="/masks/Red-Squiggles.svg" color='#c7d6d1' width='100vw' height='100vh' maskSize='cover' className={styles.resumeBackground}/>
            <h1 className={styles.heading}>Resume</h1>
            <div className={styles.resume}>
                <a className={styles.downloadButton} href='https://docs.google.com/document/d/1-O_EsqOcbVnY0tlRIP4p0EGaKX2AzlZMeZXaj3E4uS4/export?format=pdf'>< FontAwesomeIcon icon={fas.faDownload} /></a>
                <iframe src="/AmandaRobinsonResume.pdf#toolbar=0&navpanes=0&scrollbar=0"></iframe>
            </div>
        </div>
    )
}