import { Link } from "react-router-dom";

const NavigationBar = () => (
  <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sticky top-0 z-50">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">HBV Vaccine Distribution Tracker</h1>
      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-200">
          Home
        </Link>
        <Link to="/dashboard" className="hover:text-blue-200">
          Dashboard
        </Link>
      </div>
    </div>
  </nav>
);

export default NavigationBar;
