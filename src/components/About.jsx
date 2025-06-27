import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import "../style/About.css";
import eWasteImage from "../assets/ewaste.jpg";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles


const About = () => {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });  // Initializes AOS with the specified duration
      }, []);
    
  return (
    <div className="about" id="about">
      <p>-About Scrap</p>
      <h1>Making a revolution in Scrap</h1>
      <br />
      <br />
      <div className="about-area">
        <div className="about-left">
          <p>
            Welcome to ScrapBridge, your dedicated partner in tackling the global Scrap crisis. Our
            mission is to promote sustainable scrap management practices, raise awareness about the
            environmental and health impacts of Scrap, and provide practical solutions for responsible disposal
            and recycling of scrap.
            <br />
            <br />
            <b style = {{fontSize : '20px'}}>Our Mission </b>
            <br />
            At ScrapBridge, we are committed to 
            educating the public about the dangers of improper Scrap disposal and the benefits of recycling.
            <b > Facilitating</b> the safe and responsible recycling of scrap through accessible and
            convenient recycling programs.
            <b > Advocating</b> for stronger regulations and policies to ensure sustainable Scrap management and
            reduce environmental impact.
            <br />
            <br />
            <b style = {{fontSize : '20px'}}>What We Do - </b>
            <b style = {{fontSize : '20px'}}>Awareness Campaigns </b> 
            <br /> We conduct awareness campaigns to inform individuals and communities about
            the importance of proper Scrap disposal and the harmful effects of Scrap on the environment and
            human health.
            <br />
            <b style = {{fontSize : '20px'}}>Recycling Programs </b> 
            <br /> We partner with certified Scrap recycling centers to provide easy and
            efficient recycling solutions. Our programs ensure that valuable materials are recovered and hazardous
            substances are safely managed.
            <br />
            <b style = {{fontSize : '20px'}}>Community Engagement </b> <br /> We work closely with local communities, schools, and organizations to
            promote Scrap recycling initiatives and encourage participation in our programs.
            <br />
            <b style = {{fontSize : '20px'}}>Policy Advocacy </b> <br /> We advocate for comprehensive Scrap management policies at local, national, and
            international levels to drive systemic change and improve recycling rates.
            <br />
            <br />
            <b style = {{fontSize : '20px'}}>Our Vision </b> <br />
            We envision a world where scrap is no longer a threat to our environment and health. Through
            collective efforts and responsible practices, we aim to create a sustainable future where electronics
            are designed, used, and disposed of in ways that minimize their environmental footprint.
            <br />
            <br />
            <b style = {{fontSize : '20px'}}>Get Involved </b> <br />
            Join us in our mission to combat the Scrap crisis. Whether you are an individual looking to recycle
            your old devices, a business seeking sustainable Scrap management solutions, or a community group
            interested in partnering with us, there are many ways to get involved and make a difference.
            <br /><br />
            <b style = {{fontSize : '20px'}}>Donate Your Electronics </b> <br /> Bring your old electronics to one of our recycling centers or participate in our take-back programs.
            <br /><br />
            <b style = {{fontSize : '20px'}}>Volunteer </b> <br /> Help us spread the word and assist with our awareness campaigns and community events.
            <br /><br />
            <b style = {{fontSize : '20px'}}>Support Our Work </b> <br /> Consider making a donation to support our initiatives and expand our reach.
            <br /><br />
            Together, we can make a significant impact on reducing Scrap and protecting our planet for future
            generations. Thank you for being part of the solution!
          </p>
          <br />
          <div className="btns">
            <Link to="/contact" id="contact-btn">CONTACT US</Link>
            <Link to="/e-facility" id="about-recycle-btn">RECYCLE SERVICES</Link>
          </div>
        </div>
        <div className="about-right" data-aos="zoom-in-down" >
          <img src={eWasteImage} alt=".." />
        </div>
      </div>
    </div>
  );
};

export default About;
