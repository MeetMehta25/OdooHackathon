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
          control platform. Designed for inventory managers and warehouse staff to
          handle receiving, dispatching, transfers, and accurate counting.
        </p>

        <ol className="list-decimal list-inside text-left text-gray-700 dark:text-gray-300 space-y-2">
          <li>Track incoming and outgoing stock with accuracy.</li>
          <li>Manage warehouse transfers and daily operations.</li>
          <li>Maintain real-time inventory visibility across locations.</li>
          <li>Reduce human errors and streamline workflows.</li>
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
