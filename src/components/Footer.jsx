import React from 'react';
import logoFooter from '../assets/logo-footer.png';
import '../style/Home.css';
import { Link } from 'react-router-dom';
export const Footer = () => {
    const handleSubmit = () => {
        alert("Thanks for contacting us!")
        window.location.reload();
    };
    return (
        <>
        <footer>
            <div className="footer-about">
                <form onSubmit={handleSubmit}>
                    <span>
                        <img src={logoFooter} alt="Logo" /> SCRAP BRIDGE
                    </span>
                    <p>Dedicated to sustainable waste management and environmental protection.</p>

                    <div style={{ position: 'relative', width: '100%', maxWidth: '200px' }}>
                        <input type="email" placeholder="Enter your email*" name="index_gmail" required />
                        <button type="submit" style={{ width: '30px', height: '30px' }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/60/60525.png" alt="Send" style={{ width: '100%', height: '100%' }} />
                        </button>
                    </div>
                </form>
            </div>

            <div className="footer-services">
                <h3>Our Services</h3>
                <Link to="/e-facility">Sell Scrap</Link><br />
                <Link to="">Bid your item</Link>
            </div>

            <div className="footer-company">
                <h3>Company</h3>
                <Link to="/about">About Us</Link><br />
                <Link to="/e-facility">Find Scrap-Collectors</Link><br />
                <Link to="/education">Education</Link><br />
                <Link to="/contact">Contact Us</Link><br />
            </div>
        </footer>
        
        {/* <center>  MADE WITH 💜 By <span>SHIVAM SHARMA</span></center> */}
        </>
    );
};
