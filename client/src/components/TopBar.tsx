import { Bell } from "lucide-react";

export default function TopBar() {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500">
            Selamat datang kembali, pantau aktivitas penggilingan Anda
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="text-gray-400 text-lg cursor-pointer hover:text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{currentDate}</p>
            <p className="text-xs text-gray-500">Hari ini</p>
          </div>
        </div>
      </div>
    </header>
  );
}
