import Link from "next/link";
import SmartNavbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AccountDeletionGuide() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <SmartNavbar />
      
      <main className="flex-grow pt-24 pb-12">
        {/* Header Section */}
        <section className="bg-black text-white py-16 px-6 text-center border-b-[6px] border-orange-500">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Account <span className="text-orange-500">Deletion Guide</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Follow these instructions to permanently delete your account and data from lagama.lk mobile app.
            </p>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-8">How to delete your account in the app</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-l-4 border-black shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-black text-white flex items-center justify-center rounded-full font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Open the App & Log In</h3>
                <p className="text-gray-600">Launch the mobile app on your device and ensure you are logged into the account you wish to delete.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-l-4 border-orange-500 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-black flex items-center justify-center rounded-full font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Navigate to your Profile</h3>
                <p className="text-gray-600">Tap on the <strong>Profile</strong> icon located in the bottom navigation bar to view your account settings.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg border-l-4 border-black shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-black text-white flex items-center justify-center rounded-full font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Scroll to the Bottom</h3>
                <p className="text-gray-600">Scroll all the way down to the bottom of your Profile page.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-6 bg-red-50 rounded-lg border-l-4 border-red-600 shadow-sm">
              <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white flex items-center justify-center rounded-full font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Tap "Delete Account" & Confirm</h3>
                <p className="text-gray-700">
                  Tap the red <strong>Delete Account</strong> button. A confirmation popup will appear. Read the warning carefully, then confirm to permanently erase all your data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Policy / What happens next */}
        <section className="max-w-4xl mx-auto px-6 pb-16">
          <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md">
            <h2 className="text-2xl font-bold mb-4">What happens to my data?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3 mb-6">
              <li>Your personal profile information (name, email, etc.) will be permanently erased.</li>
              <li>Your location history and saved preferences will be wiped from our servers.</li>
              <li>Any active sessions will be immediately logged out.</li>
              <li><strong>This action is irreversible.</strong> Once deleted, your account cannot be recovered.</li>
            </ul>

            <hr className="border-gray-200 my-6" />
{/* 
            <h3 className="text-xl font-bold mb-2">Don't have the app installed anymore?</h3>
            <p className="text-gray-600 mb-4">
              If you have already uninstalled the app and need your account deleted, you can request manual deletion by contacting our support team.
            </p>
<a 
  href="https://mail.google.com/mail/?view=cm&fs=1&to=lagamalk7@gmail.com.com&su=Account%20Deletion%20Request" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800 transition"
>
  Request Manual Deletion
</a> */}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}