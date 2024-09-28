const Header = () => {
    return (
        <header className="header" id="header">
            <nav className="nav container">
                <a href="#" className="nav__logo">
                    Travel
                </a>

                <div className="nav__menu" id="nav-menu">
                    <ul className="nav__list">
                        <li className="nav__item">
                            <a href="#home" className="nav__link active-link">
                                Home
                            </a>
                        </li>
                        <li className="nav__item">
                            <a href="#about" className="nav__link">
                                About
                            </a>
                        </li>
                        <li className="nav__item">
                            <a href="#discover" className="nav__link">
                                Discover
                            </a>
                        </li>
                        <li className="nav__item">
                            <a href="#place" className="nav__link">
                                Places
                            </a>
                        </li>
                    </ul>

                    <div className="nav__dark">
                        {/* <!-- Theme change button --> */}
                        <span className="change-theme-name">Dark mode</span>
                        <i
                            className="ri-moon-line change-theme"
                            id="theme-button"
                        ></i>
                    </div>

                    <i className="ri-close-line nav__close" id="nav-close"></i>
                </div>

                <div className="nav__toggle" id="nav-toggle">
                    <i className="ri-function-line"></i>
                </div>
            </nav>
        </header>
    );
};

export default Header;
