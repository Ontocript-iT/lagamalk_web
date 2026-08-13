import Link from "next/link";
import SmartNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <SmartNavbar />
      
      {/* main content gets flex-grow to push footer to bottom */}
      <main className="flex-grow pt-24 pb-12">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-6 text-center border-b-[6px] border-orange-500">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              Terms & <span className="text-orange-500">Conditions</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
              Welcome to our lagama.lk App (referred to as the &quot;App&quot; or &quot;Service&quot;). Please read these Terms and Conditions carefully before using the App. By accessing or using the App, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium">
              Last Updated: 20th Auguest 2026
            </p>
          </div>
        </section>

        {/* Terms Content Section */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div className="space-y-12">
            
            {/* Section 1 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                1. General Conditions & Acceptance
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Acceptance of Terms:</strong> By accessing or using any part of the App, you agree to comply with and be bound by these Terms and Conditions.</li>
                <li><strong className="text-black">Age Limit:</strong> There is no age limit for using this App. It is accessible to users of all ages.</li>
                <li><strong className="text-black">Governing Law:</strong> These terms and any disputes arising from the use of this Service shall be governed by and construed in accordance with the laws of Sri Lanka.</li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                2. Description of Service
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Discovery Platform:</strong> The App serves as a search platform that enables users to find, browse, and explore e-commerce shops, locations (&quot;places&quot;), and promotional offers.</li>
                <li><strong className="text-black">Scope of Liability:</strong> The App operates strictly as a discovery and search platform. The App and its parent API company are not party to, nor responsible for, any direct purchases, transactions, quality of goods, or fulfillment between shops and customers.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                3. User Accounts & Registration
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Guest Access:</strong> Browsing and searching for places and offers is completely free and does not require registering for an account.</li>
                <li><strong className="text-black">Account Requirement:</strong> To access personalized features—such as saving favorite places or offers—normal users are required to create an account.</li>
                <li><strong className="text-black">Account Security:</strong> Users are solely responsible for maintaining the confidentiality of their login credentials and password, as well as for all activities conducted under their account.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                4. Business Subscriptions & Listings
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Subscription Model:</strong> Business owners must purchase a subscription plan to add and manage their places and offers within the App.</li>
                <li>
                  <strong className="text-black">Pricing & Billing Cycles:</strong> Subscription fees are determined based on the number of places added. Businesses can choose from the following billing cycles:
                  <ul className="list-circle pl-6 mt-2 space-y-1">
                    <li>Monthly</li>
                    <li>3 Months</li>
                    <li>6 Months</li>
                    <li>Annually</li>
                  </ul>
                </li>
                <li><strong className="text-black">Accuracy of Information:</strong> Businesses are solely responsible for ensuring that all uploaded details—including business locations, offer terms, pricing, and images—are accurate, lawful, and up to date.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                5. Prohibited Conduct
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                Users and business owners agree not to engage in any of the following prohibited activities:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li>Posting false, misleading, fraudulent, or illegal offers and business information.</li>
                <li>Attempting to scrape data, reverse-engineer, or disrupt the App&apos;s API, servers, or underlying technical infrastructure.</li>
                <li>Misusing trademarks, logos, or intellectual property belonging to third parties without authorization.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                6. Limitation of Liability
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Third-Party Content:</strong> The App is not responsible for expired offers, inaccurate business listings, or the quality of products and services provided by listed shops.</li>
                <li><strong className="text-black">Service Availability:</strong> The App does not guarantee uninterrupted uptime. We are not liable for temporary service outages caused by server maintenance, technical updates, or unforeseen disruptions.</li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                7. Account Termination
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                The company reserves the right to suspend, disable, or permanently terminate any user or business account at any time, without prior notice, if there is a violation of these Terms and Conditions.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-black pl-4">
                8. Intellectual Property
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">App Assets:</strong> All software, API architecture, source code, designs, branding, and logos associated with the App are the exclusive property of the API company.</li>
                <li><strong className="text-black">User Content:</strong> Businesses retain ownership of the logos, media, and text they upload. However, by listing on the App, businesses grant the company a non-exclusive license to display and distribute this content within the platform.</li>
              </ul>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-4">
                9. Contact Us
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
              </p>
              <ul className="list-disc pl-6 space-y-3 text-gray-600 text-lg">
                <li><strong className="text-black">Email:</strong> lagamalk@ontocript.com</li>
              </ul>
            </div>

          </div>
        </section>

        {/* CTA / Contact Section */}
        <section className="max-w-4xl mx-auto text-center px-6 pt-8 pb-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold mb-4">Need further clarification?</h2>
          <p className="text-gray-600 text-lg mb-8">
            Our support team is available to help you understand our terms of service.
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