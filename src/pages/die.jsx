import Head from "next/head";
import Image from 'next/image';
import { Eater, Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import Link from 'next/link';

export default function Home() {
    return (
        <div className="m-3 flex items-center flex-col">
            <Image src="/die.gif" alt="" height={1000} width={1000} />
            <Link href='/'>
                <button className="rounded-full border border-white p-3  text-5xl self-center m-3">
                    重新
                </button>
            </Link>
        </div>
    );
}
