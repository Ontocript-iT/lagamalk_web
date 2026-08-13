import Link from "next/link";
import SmartNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <SmartNavbar />
      
      {/* main content gets flex-grow to push footer to bottom */}
      <main className="flex-grow pt-24 pb-12">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6 text-center border-b-[6px] border-orange-500">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Privacy <span className="text-orange-500">Policy</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Ontocript IT (Pvt) Ltd ("we," "our," or "us") operates the lagama.lk mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our app and the choices you have associated with that data.
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium">
              Last Updated: 20th August 2026
            </p>
          </div>
        </section>

        {/* Privacy Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                1. Information We Collect
              </h2>
              
              <h3 className="text-xl font-bold text-black mt-6 mb-3">
                A. User-Provided Personal Data:
              </h3>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                When you register or use our app, we may ask you to provide certain personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg mb-6">
                <li><strong className="text-black">First Name and Last Name</strong></li>
                <li><strong className="text-black">Email Address</strong></li>
                <li><strong className="text-black">Mobile Phone Number</strong></li>
                <li><strong className="text-black">Password</strong> (stored in an encrypted format)</li>
                <li><strong className="text-black">Photos</strong> uploaded from your device gallery</li>
              </ul>

              <h3 className="text-xl font-bold text-black mt-6 mb-3">
                B. Automatically Collected Data:
              </h3>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                When you access the app, we may automatically collect certain technical data, including:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Device Model</strong> and Hardware details</li>
                <li><strong className="text-black">Operating System version</strong> (Android or iOS)</li>
                <li><strong className="text-black">IP Address</strong></li>
                <li><strong className="text-black">App performance data</strong> and crash logs</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                2. Device Permissions
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                To provide full functionality, our app requests access to the following permissions:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Location Services:</strong> Used via geolocator to provide location-based features and map integration.</li>
                <li><strong className="text-black">Camera & Photos / Storage:</strong> Used to select, upload, and display profile images or app-related photos from your device gallery.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                3. How We Use Your Data
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li>To create and manage your user account securely.</li>
                <li>To provide features such as interactive maps and location-based services.</li>
                <li>To offer customer support and respond to user inquiries.</li>
                <li>To identify bugs, fix technical issues, and improve app performance.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                4. Third-Party Services and Local Data Storage
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                We utilize trusted third-party technologies and local storage mechanisms to operate our app:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg mb-4">
                <li><strong className="text-black">Location & Map Services (Mx / ap):</strong> Process location queries to render map features.</li>
                <li><strong className="text-black">Local Storage (Hive / GetStorage):</strong> We use encrypted local storage on your device to store temporary application state and user preferences for offline accessibility.</li>
              </ul>
              <p className="text-gray-600 text-lg leading-relaxed mt-4 font-semibold">
                We do not sell, rent, or trade your personal data to third-party advertisers.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                5. Account and Data Deletion
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                We respect your right to control your personal data.
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">How to request deletion:</strong> Users can request full account and data deletion by contacting our administration at lagamak@ontocript.com or submitting a request via <a href="https://lagama.lk/contact" className="text-blue-500 hover:underline">contact forms</a> on our website.</li>
                <li><strong className="text-black">Safety Verification:</strong> For safety and fraud prevention purposes, all deletion requests are manually verified and executed by our admin team. Once verified, all your personal data will be permanently removed from our active databases.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                6. Children's Privacy
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our app is suitable for users of all ages. We do not intentionally target or collect personal data from children under the age of 13 without appropriate consent.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                7. Contact Us
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                If you have any questions or concerns regarding this Privacy Policy, please contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Email:</strong> lagamalk@ontocript.com</li>
                <li><strong className="text-black">Website / Support Page:</strong> <a href="https://lagama.lk/contact" className="text-blue-500 hover:underline">Contact Us</a></li>
              </ul>
            </div>

          </div>
        </section>

        {/* CTA / Contact Section */}
        <section className="max-w-4xl mx-auto text-center px-6 pt-8 pb-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-4">Have questions about your data?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Our support team is here to help clarify how we protect your privacy.
          </p>
          <Link href="/contact" className="inline-block bg-black text-white px-8 py-3 rounded-md text-lg font-bold hover:bg-gray-800 transition shadow-lg mr-4">
            Contact Support
          </Link>
          <Link href="/" className="inline-block bg-orange-500 text-black px-8 py-3 rounded-md text-lg font-bold hover:bg-orange-400 transition shadow-lg mt-4 sm:mt-0">
            Return Home
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}