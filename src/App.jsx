import About from "./components/About";
import Discover from "./components/Discover";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";
import { ThemeProvider } from "./ThemeContext";

const App = () => {
    return (
        <ThemeProvider>
            <Header />
            <main className="main">
                <Home />
                <About />
                <Discover />
            </main>
            <Footer />
        </ThemeProvider>
    );
};

export default App;
