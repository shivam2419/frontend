import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import communityImg from "../assets/community.jpg";
import ewasteImg from "../assets/ewaste.jpg";
import '../style/Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles


const Home = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });  // Initializes AOS with the specified duration
    }, []);
    const questions = {
        "What is ScrapBridge?": "ScrapBridge is a smart scrap management platform that connects households with verified scrap collectors for seamless waste disposal at fair prices.",
        "How can I contact customer support?": "You can reach us via email, phone, or the chatbot available on the website for any queries or issues.",
        "How does the ML-based classification system work?": "The system analyzes uploaded images and classifies them into categories like plastic, metal, or paper using a trained model.",
        "Can I check scrap prices before selling?": "Yes, ScrapBridge provides real-time metal price updates, ensuring that users get the best possible rates.",
        "How does ScrapBridge work?": "Users upload scrap details or images, and the platform classifies them using machine learning. A nearby collector is assigned, and users receive real-time notifications until the scrap is picked up."
    };
    useEffect(() => {
        const timer = setTimeout(() => {
        }, 500); // 0.5 seconds

        return () => clearTimeout(timer);
    }, []);

    const [openFAQ, setOpenFAQ] = useState(null);


    return (
        <div>
            <div className="content">
                <div className="content-left">
                    <p>-Welcome to ScrapBridge</p>
                    <h1>
                        "Empowering Communities, <br /> Sustaining future: Your Guide <br />
                        to Responsible Waste Disposal"
                    </h1>
                    <h1
                        style={{ color: "#4e35f0" }}
                        data-aos="fade-right"
                        data-aos-easing="linear"
                        data-aos-duration="1000"
                    >
                        Waste Facility Locator
                    </h1>
                    <h3>
                        ScrapBridge : Transforming Waste management. Find Waste facilities <br />
                        effortlessly with our platform
                    </h3>
                    <br />
                    <button><Link to="/prices">PRICE LIST</Link></button>
                    <button><Link to="/e-facility">RECYCLE SCRAP</Link></button>
                </div>

                <div className="content-right">
                    <img src={communityImg} alt="Community working for environment" />
                </div>
            </div>
            <div className="marquee">
                <div className="marquee-content">
                    <span>
                        💰 Latest Silver Price: <span style={{ color: "green" }}>₹85,000.40</span> per kg
                    </span>
                    <span style={{ marginLeft: "50px" }}>
                        💰 Latest Platinum Price: <span style={{ color: "green" }}>₹2,625</span> per gram
                    </span>
                    <span style={{ marginLeft: "50px" }}>
                        💰 Latest Iron Price: <span style={{ color: "green" }}>₹64</span> per kg
                    </span>
                </div>
            </div>

            <div className="about" id="about">
                <p>-About ScrapBridge</p>
                <h1>Making a revolution in Trash</h1>
                <br /><br />
                <div className="about-area">
                    <div className="about-left">
                        <p>
                            Welcome to ScrapBridge, your dedicated partner in tackling the global waste crisis. Our
                            mission is to promote sustainable waste management practices, raise awareness about the
                            environmental and health impacts of waste, and provide practical solutions for responsible disposal
                            and recycling of scrap.
                            <br /><br />
                            <b>Our Mission</b>
                            <br />
                            At ScrapBridge, we are committed to:
                            <b> Educating</b> the public about the dangers of improper waste disposal and the benefits of recycling.
                            <b> Facilitating</b> the safe and responsible recycling of scrap through accessible and
                            convenient recycling programs.
                            <b> Advocating</b> for stronger regulations and policies to ensure sustainable scrap management and
                            reduce environmental impact... <Link to="/about">Read more</Link>
                        </p>
                        <br /><br />
                        <div className="btns">
                            <Link to="/contact" id="contact-btn">CONTACT US</Link>
                            <Link to="/e-facility" id="home-recycle-btn">RECYCLE SERVICES</Link>
                        </div>
                    </div>
                    <div
                        className="about-right"
                    >
                        <img src={ewasteImg} alt="E-waste collection process" />
                    </div>
                </div>
            </div>

            <div className="points">
                {[...Array(2)].map((_, part) => (
                    <div className="points-part1" key={part}>
                        {[
                            ["Waste Collection", "A network of certified waste collection facilities..."],
                            ["Educational Resources", "Providing educational resources for users to understand..."],
                            ["User-Friendly Interface", "User friendly interface for easily integrating with our..."]
                        ].map((item, i) => (
                            <div className="points-card" key={i}>
                                <div className="points-square">
                                    <h2>{String(part * 3 + i + 1).padStart(2, '0')}</h2>
                                </div>
                                <div className="points-content">
                                    <h3>{item[0]}</h3>
                                    <p>{item[1]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="faq-section">
                <h1>Frequently Asked Questions</h1>
                <ul className="faq">
                    {Object.entries(questions).map(([question, answer], index) => (
                        <li key={index}>
                            <div
                                className="q"
                                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                            >
                                <span className={`arrow ${openFAQ === index ? "arrow-rotated" : ""}`}></span>
                                <span style={{ backgroundColor: "white" }}>{question}</span>
                            </div>
                            <div className={`a ${openFAQ === index ? "a-opened" : ""}`}>
                                <p>{answer}</p>
                            </div>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default Home;
