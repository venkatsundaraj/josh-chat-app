import { db } from "@/utils/db";
import Image from "next/image";
import React from "react";
import { NextPage } from "next";

export default async function Home(){
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello world...</h1>
    </main>
  ) ;
}
