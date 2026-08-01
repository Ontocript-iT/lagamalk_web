import { Outfit } from "next/font/google";
import "./globals.css";

// Outfit is a clean, modern geometric sans-serif very similar to Fiverr's branding
const fiverrLikeFont = Outfit({ 
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: '--font-fiverr'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fiverrLikeFont.className} bg-white text-black`}>
        {children}
      </body>
    </html>
  );
}