import Link from "next/link";
import SmartNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <SmartNavbar />
      
      {/* main content gets flex-grow to push footer to bottom */}
      <main className="flex-grow pt-24 pb-12">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6 text-center border-b-[6px] border-orange-500">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Connecting You to Your <span className="text-orange-500">World</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Near Me was built on a simple idea: the best experiences, services, and places shouldn't be hard to find. We bridge the gap between local communities and the businesses that serve them.
            </p>
          </div>
        </section>

        {/* Mission & Values Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4 text-lg">
                We empower users to discover hidden gems and essential services right around the corner, while giving local partners the platform they need to thrive in a digital-first world.
              </p>
              <p className="text-gray-600 text-lg">
                Whether you are looking for a quick bite, a reliable mechanic, or a quiet place to work, Near Me puts the power of discovery directly in your pocket.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2">Hyper-Local</h3>
                <p className="text-gray-600 text-sm">Precision location tracking to show you exactly what is closest to you right now.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-black shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2">Verified Partners</h3>
                <p className="text-gray-600 text-sm">Every business on our platform is vetted to ensure quality and reliability.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-black shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2">Real-Time</h3>
                <p className="text-gray-600 text-sm">Live updates on opening hours, availability, and instant bookings.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500 shadow-sm hover:shadow-md transition">
                <h3 className="text-xl font-bold mb-2">Community Driven</h3>
                <p className="text-gray-600 text-sm">Honest reviews and ratings from people who live in your neighborhood.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to start exploring?</h2>
          <Link href="/" className="inline-block bg-orange-500 text-black px-8 py-3 rounded-md text-lg font-bold hover:bg-orange-400 transition shadow-lg">
            Download the App
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}