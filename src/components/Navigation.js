import { NavLink } from 'react-router-dom';
import "../assets/styles/style.css";
import searchIcon from "../assets/icons/search.svg";
import accountIcon from "../assets/icons/account.svg";

function Navigation() {
    return (
        <header>
            <div className="header__title">
                <NavLink to="/main" className="page-logo">gamevault</NavLink>
            </div>
            <nav>
                <NavLink to="/search"><img className="nav__icon" src={searchIcon} alt=""/></NavLink>
                <NavLink to="/account"><img className="nav__icon" src={accountIcon} alt=""/></NavLink>
            </nav>
        </header>
    );
}

export default Navigation;