import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Find Everything <span className="text-orange-500">Near Me</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10">
          The ultimate location search app. Discover restaurants, services, and hidden gems right around the corner. 
        </p>
        
        <div className="space-x-4">
          <button className="bg-black text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-gray-800 transition shadow-lg">
            Download App
          </button>
          <button className="bg-orange-500 text-black px-8 py-3 rounded-md text-lg font-bold hover:bg-orange-400 transition shadow-lg">
            Partner With Us
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}