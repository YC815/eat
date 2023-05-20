import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from 'next/image';
import { Eater, Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from 'next/link';

const foodimage = [
    '/food/1.jpg',
    '/food/2.jpg'
];

export default function Home() {
    const router = useRouter();
    const [buttonClicked, setButtonClicked] = useState(false);
    const [randomImage, setRandomImage] = useState(null);

    useEffect(() => {
        console.log("頁面被載入");

        const randomIndex = Math.floor(Math.random() * foodimage.length);
        const randomImagePath = foodimage[randomIndex];
        setRandomImage(randomImagePath);
        console.log("圖片I");
    }, []);

    {
        randomImage && (
            <div className={styles.imageContainer}>
                <Image src={randomImage} alt="隨機圖片" width={300} height={200} />
            </div>
        )
    }

    const eat = () => {
        console.log('玩家按下按鈕"吃"');
        setButtonClicked(true);
    };

    const deat = () => {
        console.log('玩家按下按鈕"不吃"');
        setButtonClicked(true);
        window.location.reload(); // 在按下"不吃"按钮后重新加载页面
    };

    return (
        <>
            <div className="m-3 flex items-center flex-col">
                {randomImage && (
                    <div className={styles.imageContainer}>
                        <Image src={randomImage} alt="隨機圖片" width={300} height={200} />
                    </div>
                )}


            </div>

            <div className="absolute bottom-3 w-full">
                <div className="flex justify-center">
                    <button onClick={eat} className="rounded-full border mr-3 border-white p-3 text-5xl self-center bg-green-700 text-white">
                        吃！
                    </button>
                    <button onClick={deat} className="rounded-full border border-white p-3 text-5xl self-center bg-red-500 text-white">
                        不吃
                    </button>
                </div>
            </div>
        </>

    );
}