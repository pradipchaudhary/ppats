import { useEffect } from "react";

const ScrollToTopButton = () => {
    useEffect(() => {
        // Function to handle the scroll event
        const scrollUp = () => {
            const scrollUpButton = document.getElementById("scroll-up");
            // Check if scrollY is greater than or equal to 200
            if (window.scrollY >= 200) {
                scrollUpButton.classList.add("show-scroll");
            } else {
                scrollUpButton.classList.remove("show-scroll");
            }
        };

        // Add the scroll event listener when the component mounts
        window.addEventListener("scroll", scrollUp);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener("scroll", scrollUp);
        };
    }, []); // Empty dependency array ensures this runs once after the initial render

    return (
        <a href="#" id="scroll-up" className="scroll-top">
            Scroll to Top
        </a>
    );
};

export default ScrollToTopButton;
