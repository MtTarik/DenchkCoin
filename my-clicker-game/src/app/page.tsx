import Image from "next/image";
import styles from "./page.module.css";
import MultiTouchClickerGame from "@/components/MultiTouchClickerGame";
import Head from "next/head";
import Header from "@/components/Header/Header";

export default function Home() {
  return (
      <main className={styles.main}>
        <div>
          <Head>
            <title>Клікер Гра для Сенсорного Екрану</title>
            <meta name="description" content="Проста клікер гра для сенсорного екрану на Next.js"/>
            <link rel="icon" href="/favicon.ico"/>
          </Head>

          <main>

            <MultiTouchClickerGame/>
          </main>
        </div>

      </main>
  );
}
