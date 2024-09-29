import About from "./components/About";
import Discover from "./components/Discover";
import Experience from "./components/Experience";
import Video from "./components/Video";
import Place from "./components/Place";
import Subscribe from "./components/Subscribe";
import Sponsor from "./components/Sponsor";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import { ThemeProvider } from "./ThemeContext";
import Scrollup from "./components/Scrollup";

const App = () => {
    return (
        <ThemeProvider>
            <Header />
            <main className="main">
                <Home />
                <About />
                <Discover />
                <Experience />
                <Video />
                <Place />
                <Subscribe />
                <Sponsor />
            </main>
            <Footer />
            <Scrollup />
        </ThemeProvider>
    );
};

export default App;
