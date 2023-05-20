// src/pages/die.jsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@/styles/Home.module.css';

export default function Die() {
  const router = useRouter();
  const [foodName, setFoodName] = useState(null);
  const [buffDiePoints, setBuffDiePoints] = useState([]);
  const [foodCounter, setFoodCounter] = useState(0);

  useEffect(() => {
    const lastFood = localStorage.getItem('lastFood');
    if (lastFood) {
      const [foodNumber, buffIndex] = lastFood.split('_');
      const food = foodData[foodNumber][0];
      setFoodName(food.name);
      if (buffIndex && food.buff[buffIndex]) {
        const buffDiePoint = food.buff[buffIndex][Object.keys(food.buff[buffIndex])[0]][0];
        setBuffDiePoints([buffDiePoint]);
      } else {
        setBuffDiePoints([]);
      }
    }
  }, []);

  useEffect(() => {
    const foodCounter = localStorage.getItem('foodCounter');
    if (foodCounter) {
      setFoodCounter(Number(foodCounter));
    }
  }, []);

  return (
    <div className="m-3 flex items-center flex-col">
      <Image src="/die.gif" alt="" height={1000} width={1000} />
      <div className="text-white text-xl mt-2 text-center">
        已吃食物數量: {foodCounter}
      {/* </div>
      <div className="text-white text-xl mt-4 text-center">
        <h2 className="text-2xl font-bold">死因：</h2>
        {foodName && (
          <ul className="list-disc list-inside">
            <li>食物死因: {foodName}</li>
            {buffDiePoints.map((diePoint, index) => (
              <li key={index}>Buff死因: {diePoint?.name}</li>
            ))}
          </ul>
        )}*/}
      </div> 
      <Link href="/">
        <button className="rounded-full border border-white p-3  text-5xl self-center m-3">
          重新
        </button>
      </Link>
    </div>
  );
}
