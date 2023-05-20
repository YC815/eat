import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Eater, Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();
    const [buttonClicked, setButtonClicked] = useState(false);
    const [randomImage, setRandomImage] = useState(null);
    const [foodData, setFoodData] = useState(null);

    useEffect(() => {
        console.log('頁面被載入');

        const fetchFoodData = async () => {
            try {
                const response = await fetch('/food/food.json');
                const data = await response.json();
                setFoodData(data);
            } catch (error) {
                console.error('無法獲取食物數據：', error);
            }
        };

        fetchFoodData();
    }, []);

    useEffect(() => {
        if (foodData) {
            const randomFoodNumber =
                Math.floor(Math.random() * Object.keys(foodData).length) + 1;
            const foodList = foodData[randomFoodNumber];
            const randomFoodIndex = Math.floor(Math.random() * foodList.length);
            const randomFood = foodList[randomFoodIndex];

            setRandomImage(`/food/${randomFoodNumber}.jpg`);
        }
    }, [foodData]);

    const eat = () => {
        console.log('玩家按下按鈕"吃"');
        setButtonClicked(true);

        if (foodData && randomImage) {
            const foodDiePoint = foodData[randomImage.slice(6, 7)][0].die_point;
            const buffDiePoints = foodData[randomImage.slice(6, 7)][0].buff.map(
                (buff) => buff[Object.keys(buff)[0]][0].die_point
            );
            const finalDiePoint = foodDiePoint + buffDiePoints.reduce((a, b) => a + b, 0);

            const randomNum = Math.floor(Math.random() * 100);

            if (randomNum < finalDiePoint) {
                router.push('/die');
            } else {
                deat();
            }
        }
    };

    const deat = () => {
        console.log('玩家按下按鈕"不吃"');
        if (foodData) {
            const randomFoodNumber =
                Math.floor(Math.random() * Object.keys(foodData).length) + 1;
            const foodList = foodData[randomFoodNumber];
            const randomFoodIndex = Math.floor(Math.random() * foodList.length);
            const randomFood = foodList[randomFoodIndex];

            setRandomImage(`/food/image/${randomFoodNumber}.jpg`);
        }
    };

    return (
        <>
            <div className="m-3 flex items-center flex-col">
                {randomImage && (
                    <div className={styles.imageContainer}>
                        <Image src={randomImage} alt="隨機圖片" width={300} height={200} />
                    </div>
                )}
                {foodData && randomImage && (
                    <div className="text-center mt-4">
                        <h2 className="text-lg font-bold">
                            {/* ex */}
                            {foodData[randomImage.match(/\/([^/]+)\.[^.]+$/)[1]][0].name}
                        </h2>
                        <p>{foodData[randomImage.slice(6, 7)][0].description}</p>
                        <p>死亡機率: {foodData[randomImage.slice(6, 7)][0].die_point}%</p>
                        {foodData[randomImage.slice(6, 7)][0].buff.map((buff, index) => (
                            <div key={index} className="mt-2">
                                <h4 className="text-sm font-semibold">＿＿＿＿＿＿＿</h4>
                                <p>{buff[Object.keys(buff)[0]][0].name}</p>
                                <p>{buff[Object.keys(buff)[0]][0].description}</p>
                                <p>死亡機率: {buff[Object.keys(buff)[0]][0].die_point}%</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="absolute bottom-3 w-full">
                <div className="flex justify-center">
                    <button
                        onClick={eat}
                        className="rounded-full border mr-3 border-white p-3 text-5xl self-center bg-green-700 text-white"
                    >
                        吃！
                    </button>
                    <button
                        onClick={deat}
                        className="rounded-full border border-white p-3 text-5xl self-center bg-red-500 text-white"
                    >
                        不吃
                    </button>
                </div>
            </div>
        </>
    );
}
