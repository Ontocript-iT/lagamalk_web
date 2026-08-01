import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-8 text-center border-t border-orange-500">
      <p>&copy; {new Date().getFullYear()} Near Me App. All rights reserved.</p>
      <div className="mt-4">
        <Link href="/privacy" className="hover:text-orange-500 mx-2 transition">Privacy Policy</Link>
      </div>
    </footer>
  );
}