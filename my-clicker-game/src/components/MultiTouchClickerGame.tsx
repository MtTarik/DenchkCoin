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
        const touches = event.touches;

        // Get the coin container's position relative to the viewport
        const coinRect = event.currentTarget.getBoundingClientRect();

        // Create an array of new touch points with unique ids
        const newTouchPoints: TouchPoint[] = Array.from(touches).map((touch, index) => ({
            id: Date.now() + index,
            x: touch.clientX - coinRect.left,
            y: touch.clientY - coinRect.top,
        }));

        // Update state with the list of touch points
        setTouchPoints((prevTouchPoints) => [...prevTouchPoints, ...newTouchPoints]);

        // Increase the current score based on the number of touches
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
                <button className={styles.coinButton}>
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
                                style={{left: point.x - 60, top: point.y - 60}}
                            >
                                +1
                            </div>
                        ))}
                    </div>
                </button>
            </div>
            <div className={styles.totalScore}>
                Denchik COIN:
            </div>
            <div className={styles.totalScore}>
                DHT: {totalScore} scam product LOL
            </div>
        </div>
    );
};

export default MultiTouchClickerGame;
