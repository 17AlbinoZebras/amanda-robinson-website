import Image from "next/image";

import HomePage from "./home_page";

import styles from "./styles/page.module.css";

import '@fontsource/new-amsterdam';
import '@fontsource/idiqlat';
import '@fontsource-variable/afacad-flux/wght.css';


export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <HomePage/>
      </main>
    </div>
  );
}
