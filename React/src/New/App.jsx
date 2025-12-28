import Map from './Map';
import Pets from './Arrays';
import './App.css';

function App() {
    return (
        <>
            <header>
                <h1>Pets</h1>
            </header>
            <main>
                {
                    Pets.map((pet, index) => <Map src={pet.src} detail={pet.detail} key={index} />)
                }
            </main>
            <footer>
                <span>&copy;</span>
                <h3>Pets</h3>
                <h3>2025</h3>
            </footer>
        </>
    )
}

export default App;