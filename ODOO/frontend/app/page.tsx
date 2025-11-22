import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20">
      <main className="flex flex-col items-center gap-10 text-center max-w-2xl">
        
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to StockMaster
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          A modular Inventory Management System that replaces manual registers,
          spreadsheets, and scattered tracking with a centralized, real-time stock
          control platform. Manage products like Samsung Galaxy phones, Apple MacBooks,
          and warehouse locations from Mumbai to Delhi with precision and ease.
        </p>

        <ol className="list-decimal list-inside text-left text-gray-700 dark:text-gray-300 space-y-2">
          <li>Track Samsung phones, laptops, and electronics across Mumbai warehouse.</li>
          <li>Manage transfers between Mumbai and Delhi warehouses seamlessly.</li>
          <li>Monitor real-time stock levels for all products and locations.</li>
          <li>Automate inventory counting and reduce manual errors by 95%.</li>
        </ol>

        <Link
          href="/login"
          className="btn-primary"
        >
          Get Started
        </Link>
      </main>

      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        StockMaster Inventory Management System
      </footer>
    </div>
  );
}
