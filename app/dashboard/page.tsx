export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-2">Welcome Back, Admin</h1>
      <p className="text-gray-500 mb-8 text-lg">Here is what is happening with Lagama LK today.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-orange-500 hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Locations</h3>
          <p className="text-4xl font-black mt-2">1,245</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-black hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Active Partners</h3>
          <p className="text-4xl font-black mt-2">843</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-t-4 border-t-gray-300 hover:shadow-md transition">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Pending Tasks</h3>
          <p className="text-4xl font-black mt-2 text-orange-500">12</p>
        </div>
      </div>
    </div>
  );
}