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
                <div></div>
            </main>
            <Footer />
        </ThemeProvider>
    );
};

export default App;
