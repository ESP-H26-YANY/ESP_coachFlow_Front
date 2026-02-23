import { Outlet } from "react-router-dom";
import MyNavbar from "./CoachNavbar"; 
import MyFooter from "./Footer";

export default function CoachLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="border-b-4 border-purple-600">
        <MyNavbar />
      </div>
      
      <main className="container mx-auto p-6 flex-grow">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-100">
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300 mb-4 inline-block">ESPACE COACH</span>
          {/* Les PAGEEEEs seront ici */}
          <Outlet /> 
        </div>
      </main>

      <MyFooter />
    </div>
  );
}