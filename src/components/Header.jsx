import {
    RiCloseLine,
    RiFunctionLine,
    RiMoonLine,
    RiSunLine,
} from "@remixicon/react";
import { useState } from "react";
import { useTheme } from "../ThemeContext";

const Header = () => {
    const [isDark, setIsDark] = useState(true);
    const { theme, toggleTheme } = useTheme();
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
                        {theme == "light" ? (
                            <RiMoonLine
                                className="ri-moon-line change-theme"
                                id="theme-button"
                                onClick={() => toggleTheme("dark-theme")}
                            />
                        ) : (
                            <RiSunLine
                                className="ri-sun-line change-theme"
                                id="theme-button"
                                onClick={() => toggleTheme("dark-theme")}
                            />
                        )}
                    </div>

                    <RiCloseLine className="ri-close-line" id="nav-close" />
                </div>

                <div className="nav__toggle" id="nav-toggle">
                    <RiFunctionLine className="ri-function-line" />
                </div>
            </nav>
        </header>
    );
};

export default Header;
