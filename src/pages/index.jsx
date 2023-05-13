import Head from "next/head";
import Image from 'next/image';
import { Eater, Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";

export default function Home() {
  return (
    <div className="m-3">
      <h1 className="text-5xl font-a text-center ">吃！</h1>

      <div className="flex items-center justify-center flex-col m-9 ">
        <button class="rounded-full border border-white p-3  text-5xl self-center ">
          開始遊戲
        </button>
      </div>
      <Image src="/eat.gif" alt="" height={1000} width={1000} />
    </div>
  );
}
