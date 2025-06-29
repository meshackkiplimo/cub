import { useState } from "react";
import { Outlet } from "react-router-dom";

import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import UserDrawer from "./aside/userDrawer";


const UserDashboard = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen((prev) => !prev);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Top bar */}
            <div className="flex px-4 py-4 bg-gray-700 items-center">
                {/* Drawer toggle button: visible on small screens */}
                <button
                    className="mr-4 text-white text-2xl lg:hidden"
                    onClick={handleDrawerToggle}
                >
                    {drawerOpen ? <IoCloseSharp /> : <FaBars />}
                </button>
                <span className="text-white text-lg font-semibold">
                    Welcome to your User dashboard
                </span>
            </div>

            <div className="flex flex-1">
                {/* Drawer */}
                <aside
                    className={`
                        fixed top-0 z-40 w-64 bg-amber-400 
                        ${drawerOpen ? "" : "hidden"} 
                        lg:static lg:block lg:w-64
                        `}
                    style={{ minHeight: "100vh" }}
                >
                    <div className="h-full">
                        {/* Close button for mobile */}
                        <button
                            className="absolute top-4 right-4 text-white text-2xl lg:hidden"
                            onClick={handleDrawerToggle}
                        >
                            <IoCloseSharp />
                        </button>
                        <UserDrawer />
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 bg-green-200 min-h-screen">
                    <Outlet />
                </main>
            </div>
        
        </div>
    );
};

export default UserDashboard;