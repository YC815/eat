import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [randomFoodNumber, setRandomFoodNumber] = useState(null);
  const [randomFoodIndex, setRandomFoodIndex] = useState(null);
  const [randomFood, setRandomFood] = useState(null);
  const [foodData, setFoodData] = useState(null);
  const [prevRandomFood, setPrevRandomFood] = useState(null);
  const [foodCounter, setFoodCounter] = useState(0);

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const response = await fetch('/food/food.json');
        if (!response.ok) {
          throw new Error('Failed to fetch food data');
        }
        const data = await response.json();
        setFoodData(data);
        console.log('Number of food categories:', Object.keys(data).length);
      } catch (error) {
        console.error('Unable to fetch food data:', error);
      }
    };

    fetchFoodData();
  }, []);

  useEffect(() => {
    if (foodData) {
      const foodCategories = Object.keys(foodData);
      const randomFoodNumber = Math.floor(Math.random() * foodCategories.length) + 1;
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
    console.log('Player clicked "Eat" button');
    setButtonClicked(true);

    if (randomFood) {
      const foodDiePoint = randomFood.die_point;
      const buffTypes = Object.keys(randomFood.buff);
      const randomBuffTypeIndex = Math.floor(Math.random() * buffTypes.length);
      const randomBuffType = buffTypes[randomBuffTypeIndex];
      const randomBuffData = randomFood.buff[randomBuffType][0];

      const buffDiePoints = randomBuffData.map((buff) => buff.die_point);
      const finalDiePoint = foodDiePoint + buffDiePoints.reduce((a, b) => a + b, 0);

      const randomNum = Math.floor(Math.random() * 100);

      if (randomNum < finalDiePoint) {
        router.push('/die');
      } else {
        setFoodCounter(foodCounter + 1);
        deat();
      }
    }
  };

  const deat = () => {
    console.log('Player clicked "Don\'t Eat" button');
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
          console.log('test', typeof foodList, foodList)
          const remainingFood = foodList.filter(
            (food) => food !== randomFood && food !== prevRandomFood
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
              alt="Random Image"
              width={300}
              height={200}
            />
          </div>
        )}
        {randomFood && (
          <div className="text-center mt-4">
            <h2 className="text-lg font-bold">{randomFood.name}</h2>
            <p>{randomFood.description}</p>
            <p>Death Probability: {randomFood.die_point}%</p>
            {randomFood.buff.map((buff, index) => (
              <div className="mt-2" key={index}>
                <h4 className="text-sm font-semibold">____________</h4>
                <p>{buff.name}</p>
                <p>{buff.description}</p>
                <p>Death Probability: {buff.die_point}%</p>
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
            Eat!
          </button>
          <button
            onClick={deat}
            className="rounded-full border border-white p-3 text-5xl self-center bg-red-500 text-white"
          >
            Don't Eat
          </button>
        </div>
        <div className="text-white text-xl mt-2 text-center">
          Foods Eaten: {foodCounter}
        </div>
      </div>
    </>
  );
}
