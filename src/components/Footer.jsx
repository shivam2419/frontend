import React from 'react';
import logoFooter from '../assets/logo-footer.png';
import '../style/Home.css';

export const Footer = () => {
    return (
        <>
        <footer>
            <div className="footer-about">
                <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
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
                <p>Sell Scrap</p>
                <p>Bid your item</p>
            </div>

            <div className="footer-company">
                <h3>Company</h3>
                <a href="/">About Us</a><br />
                <a href="/">Find Scrap-Collectors</a><br />
                <a href="/">Education</a><br />
                <a href="/">Contact Us</a><br />
            </div>
        </footer>
        
        {/* <center>  MADE WITH 💜 By <span>SHIVAM SHARMA</span></center> */}
        </>
    );
};
