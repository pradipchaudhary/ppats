import {
    RiFacebookBoxFill,
    RiInstagramFill,
    RiTwitchFill,
    RiYoutubeFill,
} from "@remixicon/react";

const Footer = () => {
    return (
        <footer className="footer section">
            <div className="footer__container container grid">
                <div className="footer__content grid">
                    <div className="footer__data">
                        <h3 className="footer__title">Travel</h3>
                        <p className="footer__description">
                            Travel you choose the <br /> destination, we offer
                            you the <br /> experience.
                        </p>
                        <div>
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                className="footer__social"
                            >
                                <RiFacebookBoxFill size={20} />
                            </a>
                            <a
                                href="https://twitter.com/"
                                target="_blank"
                                className="footer__social"
                            >
                                <RiTwitchFill size={20} />
                            </a>
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                className="footer__social"
                            >
                                <RiInstagramFill size={20} />
                            </a>
                            <a
                                href="https://www.youtube.com/"
                                target="_blank"
                                className="footer__social"
                            >
                                <RiYoutubeFill size={20} />
                            </a>
                        </div>
                    </div>

                    <div className="footer__data">
                        <h3 className="footer__subtitle">About</h3>
                        <ul>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    About Us
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Features
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    New & Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__data">
                        <h3 className="footer__subtitle">Company</h3>
                        <ul>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Team
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Plan y Pricing
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Become a member
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer__data">
                        <h3 className="footer__subtitle">Support</h3>
                        <ul>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    FAQs
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Support Center
                                </a>
                            </li>
                            <li className="footer__item">
                                <a href="" className="footer__link">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer__rights">
                    <p className="footer__copy">
                        &#169; 2021 Bedimcode. All rigths reserved.
                    </p>
                    <div className="footer__terms">
                        <a href="#" className="footer__terms-link">
                            Terms & Agreements
                        </a>
                        <a href="#" className="footer__terms-link">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
