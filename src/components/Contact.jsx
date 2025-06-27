import React, { useState } from 'react';
import '../style/Contact.css';
const Contact = () => {
  const backendUrl = "https://scrapbridge-api-r54n.onrender.com/api/";
    // const backendUrl = 'http://127.0.0.1:8000/api/';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(backendUrl + "contact-us/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      if (res.status === 201) {
        setFormData({
          name: '',
          email: '',
          phone_number: '',
          message: ''
        });
        alert("Your request has been sent to us. Thanks for contacting us!")
      }
    } catch (err) {
      console.error("Error : ", err);
      alert("Some error occured, please try again later");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <form onSubmit={handleSubmit}>
          <h2>Describe Your Problem</h2>
          <label htmlFor="contact-name">Your name</label>
          <br />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <br /><br />
          <label htmlFor="contact-email">Your email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <br /><br />
          <label htmlFor="contact-number">Your phone</label>
          <br />
          <input
            type="number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
          />
          <br /><br />
          <label htmlFor="contact-message">Your message</label>
          <br />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
          />
          <br /><br />
          <input type="submit" value="SEND MESSAGE" id="btn" />
        </form>
      </div>
      <div className="contact-right">
        <h2>Contact Us</h2>
        <i className="fa fa-map-marker">&nbsp;&nbsp;Faridabad, 121002</i>
        <br />
        <i className="fa fa-phone">&nbsp;&nbsp;+91 9932313440</i>
        <br />
        <i className="fa fa-envelope">&nbsp;&nbsp;shivam241980@gmail.com</i>

        <h1></h1>
        <i
          className="fa fa-linkedin-square"
          style={{ border: '1px solid black', padding: '8px' }}
        ></i>
        <i
          className="fa fa-instagram"
          style={{ border: '1px solid black', padding: '8px' }}
        ></i>
        <i
          className="fa fa-facebook-f"
          style={{ border: '1px solid black', padding: '8px' }}
        ></i>
        <i
          className="fa fa-whatsapp"
          style={{ border: '1px solid black', padding: '8px' }}
        ></i>
      </div>
    </div>
  );
};

export default Contact;
