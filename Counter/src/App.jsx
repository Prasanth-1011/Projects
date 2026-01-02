import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Counter from "./components/Counter";
import Welcome from "./components/Welcome";

import { useState } from "react";

function App() {
    const [username, setUsername] = useState("User");

    const passData = (user) => setUsername(user);

    return (
        <>
            <Header user={username} />
            <main className="flex h-[70vh] w-full flex-col items-center justify-center py-8">
                <Welcome passData={(user) => passData(user)} />
                <Counter />
            </main>
            <Footer />
        </>
    );
}

export default App;
