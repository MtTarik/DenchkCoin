// pages/index.tsx
import styles from "./page.module.css";
import MultiTouchClickerGame from "@/components/MultiTouchClickerGame";
import Head from "next/head";

export default function Home() {
    return (
        <main className={styles.main}>
            <div>
                <Head>
                    <title>Клікер Гра для Сенсорного Екрану</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
                    <meta name="description" content="Проста клікер гра для сенсорного екрану на Next.js" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main>
                    <MultiTouchClickerGame />
                </main>
            </div>
        </main>
    );
}
