import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';
import Die from './die';
export default function Home() {
  const router = useRouter();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [randomFoodNumber, setRandomFoodNumber] = useState(null);
  const [randomFoodIndex, setRandomFoodIndex] = useState(null);
  const [randomFood, setRandomFood] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [prevRandomFood, setPrevRandomFood] = useState(null);
  const [foodCounter, setFoodCounter] = useState(0); // 新增食物计数器

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await fetch('/food/food.json');
        if (!response.ok) {
          throw new Error('请求食物数据失败');
        }
        const data = await response.json();
        setFoodData(data);
        console.log('食物种类数量：', Object.keys(data).length);
      } catch (error) {
        console.error('无法获取食物数据：', error);
      }
    };

    fetchFoodData();
  }, []);

  useEffect(() => {
    if (foodData) {
      const foodCategories = Object.keys(foodData);
      const randomFoodNumber =
        Math.floor(Math.random() * foodCategories.length) + 1;
      const foodList = foodData[foodCategories[randomFoodNumber - 1]];
      if (foodList) {
        const randomFoodIndex = Math.floor(Math.random() * foodList.length);
        const randomFood = foodList[randomFoodIndex];

        setRandomFoodNumber(randomFoodNumber);
        setRandomFoodIndex(randomFoodIndex);
        setRandomFood(randomFood);
      }
    }
  }, [foodData]);

  const eat = () => {
    console.log('玩家按下按鈕"吃"');
    setButtonClicked(true);
  
    if (randomFood) {
      const foodDiePoint = randomFood.die_point;
      const buffDiePoints = randomFood.buff.map(
        (buff) => buff[Object.keys(buff)[0]][0].die_point
      );
      const finalDiePoint = foodDiePoint + buffDiePoints.reduce((a, b) => a + b, 0);

      const randomNum = Math.floor(Math.random() * 100);

      if (randomNum < finalDiePoint) {
        router.push('/die');
      } else {
        setFoodCounter(foodCounter + 1); // 食物计数器加1
        deat();
      }
    }
  };

  const deat = () => {
    console.log('玩家按下按鈕"不吃"');
    if (foodData) {
      const foodCategories = Object.keys(foodData);
      const remainingFoodCategories = foodCategories.filter(
        (category) => category !== randomFoodNumber.toString()
      );

      if (remainingFoodCategories.length > 0) {
        const randomFoodCategory =
          remainingFoodCategories[
            Math.floor(Math.random() * remainingFoodCategories.length)
          ];
        const foodList = foodData[randomFoodCategory];

        if (foodList) {
          const remainingFood = foodList.filter(
            (food) =>
              food !== randomFood && food !== prevRandomFood
          );

          if (remainingFood.length > 0) {
            const newRandomFoodIndex = Math.floor(Math.random() * remainingFood.length);
            const newRandomFood = remainingFood[newRandomFoodIndex];

            setPrevRandomFood(randomFood);
            setRandomFoodNumber(Number(randomFoodCategory));
            setRandomFoodIndex(newRandomFoodIndex);
            setRandomFood(newRandomFood);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (foodCounter > 0) {
      localStorage.setItem('foodCounter', foodCounter.toString());
    }
  }, [foodCounter]);

  return (
    <>
      <div className="m-3 flex items-center flex-col">
        {randomFood && (
          <div className={styles.imageContainer}>
            <Image
              src={`/food/image/${randomFoodNumber}.jpg`}
              alt="隨機圖片"
              width={300}
              height={200}
            />
          </div>
        )}
        {randomFood && (
          <div className="text-center mt-4">
            <h2 className="text-lg font-bold">{randomFood.name}</h2>
            <p>{randomFood.description}</p>
            <p>死亡機率: {randomFood.die_point}%</p>
            {randomFood.buff.map((buff, index) => (
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
        <div className="text-white text-xl mt-2 text-center">
          以吃食物適量: {foodCounter}
        </div>
      </div>
    </>
  );
}
