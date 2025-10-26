import react from "react";
import './Header.css';

function Topbar(){
    return(
        <nav className="topbar">
            <div className="left-links">
                <a href="#home">Home</a>
                <a href="#gift-boxes">Shop Gift Boxes</a>
                <a href="#items">Shop Items</a>
                <a href="#build">Build Your Own</a>
                <a href="#about">About Us</a>
            </div>
            <div className="right-links">
                <a href="#"><img src="/assests/icons/search.svg" className="icon" alt="Search"/> Search</a>
                <a href="#"><img src="/assests/icons/cart.svg" className="icon" alt="Cart"/> Cart</a>
                <a href="#"><img src="/assests/icons/user.png" className="icon" alt="User"/> Sign In</a>
            </div>
        </nav>
    );
}

export default Topbar;
