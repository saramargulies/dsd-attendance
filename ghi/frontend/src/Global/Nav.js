import { Link } from "react-router-dom";
import { ReactComponent as DSDLogo } from "../Images/DSDLogo.svg";
import { useAuth } from "../Auth/AuthContext";
import "./nav.css";

function Nav() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light font-link">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <DSDLogo className="nav-logo"></DSDLogo>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link active" aria-current="page">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/overview" className="nav-link" aria-current="page">
                    Overview
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Take Attendance
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link
                        to="/take-attendance/class"
                        className="dropdown-item"
                      >
                        Class
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/take-attendance/outing"
                        className="dropdown-item"
                      >
                        Outing
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Manage Outings
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/outings/create" className="dropdown-item">
                        Create New Outing
                      </Link>
                    </li>
                    <li>
                      <Link to="/outings" className="dropdown-item">
                        View & Edit Outings
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Manage Dogs
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/clients" className="dropdown-item">
                        Add a client
                      </Link>
                    </li>
                    <li>
                      <Link to="/overview/add-dog" className="dropdown-item">
                        Add a dog
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link to="/calendar" className="nav-link" aria-current="page">
                    Calendar
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={logoutUser}
                    className="nav-link btn p-2"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <a className="nav-link btn p-2" aria-current="page" href="">
                  Login
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
