"use client"
import { useState} from 'react';
import Image from 'next/image';
import styles from './MultiTouchClickerGame.module.css';
import Header from "@/components/Header/Header";

interface TouchPoint {
    id: number;
    x: number;
    y: number;
}
const MultiTouchClickerGame: React.FC = () => {
    const [currentScore, setCurrentScore] = useState<number>(0);
    const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
    const [totalScore, setTotalScore] = useState<number>(0);

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        event.preventDefault(); // Запобігаємо типовій поведінці торкання

        const touches = event.touches;

        // Отримуємо позицію контейнера монети відносно видимої частини екрану
        const coinRect = event.currentTarget.getBoundingClientRect();

        // Створюємо масив нових точок торкання з унікальними ідентифікаторами

        const newTouchPoints: TouchPoint[] = Array.from(touches).map((touch, index) => ({
            id: Date.now() + index,
            x: touch.clientX - coinRect.left,
            y: touch.clientY - coinRect.top,
        }));

        // Оновлюємо стан зі списком точок торкання
        setTouchPoints((prevTouchPoints) => [...prevTouchPoints, ...newTouchPoints]);

        // Збільшуємо поточний рахунок на основі кількості торкань
        setCurrentScore((prevScore) => {
            const newScore = prevScore + touches.length;
            setTotalScore((prevTotalScore) => prevTotalScore + touches.length);
            return newScore;
        });
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
                                style={{left: point.x - 80, top: point.y - 79}}
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
