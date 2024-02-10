import { NavLink } from 'react-router-dom';
import "../assets/styles/style.css";
import searchIcon from "../assets/icons/search.svg";
import accountIcon from "../assets/icons/account.svg";

function Main() {
    return (
        <div className="App">
            <header>
                <div className="header__title">
                    <a className="page-logo" href="/main">gamevault</a>
                </div>
                <nav>
                    <NavLink  to="/search"><img className="nav__icon" src={searchIcon} alt=""/></NavLink>
                    <NavLink to="/account"><img className="nav__icon" src={accountIcon} alt=""/></NavLink>
                </nav>
            </header>
        </div>
    );
}

export default Main;