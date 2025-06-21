
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeClassname = "text-primary font-medium";
  const inactiveClassname = "hover:text-primary font-medium";

  return (
    <nav className="navbar bg-white shadow-md px-4 fixed top-0 w-full z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/cars" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
                Cars
              </NavLink>
            </li>
            <li>
              <NavLink to="/locations" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
                Locations
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
                Contact
              </NavLink>
            </li>
          </ul>
        </div>
        <NavLink to="/" className="flex items-center gap-2">
        
          <span className="text-xl font-bold text-primary hover:text-amber-400">Kokya Yard</span>
        </NavLink>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2 ">
          <li className='hover:text-amber-400  transition duration-200'>
            <NavLink to="/" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
              Home
            </NavLink>
          </li>
          <li className='hover:text-amber-400  transition duration-200'>
            <NavLink to="/cars" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
              Cars
            </NavLink>
          </li>
          <li className='hover:text-amber-400  transition duration-200'>
            <NavLink to="/locations" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
              Bookings
            </NavLink>
          </li>
          <li className='hover:text-amber-400  transition duration-200'>
            <NavLink to="/about" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
              About
            </NavLink>
          </li>
          <li className='hover:text-amber-400  transition duration-200'>
            <NavLink to="/contact" className={({ isActive }) => isActive ? activeClassname : inactiveClassname}>
              Contact
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-end gap-2">
        
        <Link to='/signup' >
         <button  className="btn btn-primary rounded-full btn-outline bg-amber-400 hover:bg-green-600">
          Get Started
        </button>
        
        </Link>
       
      </div>
    </nav>
  );
};

export default Navbar;
