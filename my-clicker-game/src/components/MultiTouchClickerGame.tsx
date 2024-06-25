"use client"
import { useState} from 'react';
import Image from 'next/image';
import styles from './MultiTouchClickerGame.module.css';
import Header from "@/components/Header/Header";
import {
    ImpactOccurredFunction,
    NotificationOccurredFunction,
    useHapticFeedback,
} from '@vkruglikov/react-telegram-web-app';
interface TouchPoint {
    id: number;
    x: number;
    y: number;
}

const MultiTouchClickerGame: React.FC = () => {
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);

    const { impactOccurred, notificationOccurred } = useHapticFeedback();

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault();

        const touches = event.touches;
        const coinRect = event.currentTarget.getBoundingClientRect();

        const newTouchPoints: TouchPoint[] = Array.from(touches).map((touch, index) => ({
            id: Date.now() + index,
            x: touch.clientX - coinRect.left,
            y: touch.clientY - coinRect.top,
        }));

        setTouchPoints((prevTouchPoints) => [...prevTouchPoints, ...newTouchPoints]);

        setCurrentScore((prevScore) => {
            const newScore = prevScore + touches.length;
            setTotalScore((prevTotalScore) => prevTotalScore + touches.length);
            return newScore;
        });

        // Виклик тактильного зворотного зв'язку
        impactOccurred(); // Відчуття удару
        notificationOccurred(); // Відчуття сповіщення
    };

    return (
        <div className={styles.gameContainer}>
            <Header />

            <div className={styles.buttonContainer} onTouchStart={handleTouchStart}>
                <div className={styles.coinButton}>
                    <div className={styles.coinContainer}>
                        <Image
                            className={styles.coin}
                            draggable={false}
                            src="/coin.png"
                            alt="Coin"
                            width={100}
                            height={100}
                        />
                        {touchPoints.map((point) => (
                            <div
                                key={point.id}
                                className={styles.touchPoint}
                                style={{ left: point.x - 50, top: point.y - 50 }}
                            >
                                +1
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.totalScore}>
                DHT: {totalScore}
            </div>
        </div>
    );
};

export default MultiTouchClickerGame;
