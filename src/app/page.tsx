'use client'
import Image from "next/image";

import HomePage from "./home_page";

import styles from "./styles/page.module.css";

import '@fontsource/new-amsterdam';
import '@fontsource/idiqlat';
import '@fontsource-variable/afacad-flux/wght.css';
import { AllSliders } from "./sliders";
import { useState } from "react";
import Footer from "./footer";


export interface AppStateTypes {
    neverHovered: boolean,
    setNeverHovered: (v: boolean) => void;
}

export default function Home() {
    const [neverHovered, setNeverHovered] = useState(true);

    const appState: AppStateTypes = {
        neverHovered,
        setNeverHovered
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
            <HomePage/>
            <div className={styles.sliderFadeIn}>
                <AllSliders appState={appState}/>
            </div>
            <Footer/>
            </main>
        </div>
    );
}
