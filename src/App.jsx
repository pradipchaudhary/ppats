import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./components/Home";

const App = () => {
    return (
        <div>
            <Header />
            <main className="main">
                <Home />
            </main>
            <Footer />
        </div>
    );
};

export default App;
