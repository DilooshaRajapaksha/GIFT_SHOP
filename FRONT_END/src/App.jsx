import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Cart from './Pages/Cart/Cart';
import Dilivery from './Pages/Dilivery/Dilivery';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';

function App() {
  return (
   
    <Router>
       <Header/>
      <div className="App">
        
        <nav>
          <ul className="nav-links">
            <Link to="/"></Link>
            <Link to="/cart"></Link>
            <Link to="/dilivery"></Link>
          </ul>
        </nav>

    
        <Routes>
          <Route path="/" element={<h2>Welcome</h2>} />
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Dilivery" element={<Dilivery />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
