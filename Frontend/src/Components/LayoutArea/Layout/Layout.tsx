import { useEffect, useState } from "react";
import { useAutoLogout } from "../../../Utils/UseAutoLogout";
import { Copyrights } from "../Copyrights/Copyrights";
import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import { Routing } from "../Routing/Routing";
import "./Layout.css";
import { ScrollToTopButton } from "../../SharedArea/ScrollToTopButton/ScrollToTopButton";

export function Layout() {

    const [showScrollButton, setShowScrollButton] = useState(false); // State to control visibility of the scroll-to-top button

    // Automatic logout logic after token expired (24h):
    useAutoLogout();

    // Attach scroll listener on mount to toggle scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {

            // Show button if scrolled more than 300px
            if (window.scrollY > 300) {
                setShowScrollButton(true);
            }
            else {
                setShowScrollButton(false);
            }
        };

        // Scroll event listener:
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Scroll smoothly to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <div className="Layout">
            <header>
                <Header />
            </header>
            <nav>
                <Menu />
            </nav>
            <main>
                <Routing />
            </main>
            <footer>
                <Copyrights />
            </footer>

            {/* Render scroll-to-top button only if needed */}
            {showScrollButton &&  <ScrollToTopButton onClick={scrollToTop} /> }

        </div>
    );
}
