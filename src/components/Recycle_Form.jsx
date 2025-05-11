import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/recycle_form.css';
import loaderGIF from '../assets/loader.gif';

const Recycle_Form = () => {
    const backendUrl = "https://scrapbridge-api.onrender.com/api/";
    const { user_id } = useParams();

    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [formData, setFormData] = useState({
        item_type: '',
        date: '',
        phone: '',
        weight: '',
        image: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${backendUrl}owner/${user_id}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access")}`,
                    },
                });

                if (res.status === 401 || res.status === 403) {
                    alert("Authentication error. Please login again.");
                    window.location.href = '/login';
                    return;
                }

                const data = await res.json();
                setItem(data);
            } catch (err) {
                console.error("Error fetching owner details", err);
                alert("Something went wrong while fetching data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    let message = 'Geolocation error.';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Please enable location to continue.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Location info unavailable.';
                            break;
                        case error.TIMEOUT:
                            message = 'Location request timed out.';
                            break;
                    }
                    alert(message);
                }
            );
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const now = new Date();
        const order_id = `scrapbridge-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

        const form = new FormData();
        form.append("item_type", formData.item_type);
        form.append("date", formData.date);
        form.append("phone", formData.phone);
        form.append("weight", formData.weight);
        form.append("image", formData.image);
        form.append("location", `${latitude} ${longitude}`);
        form.append("user", localStorage.getItem('user_id'));
        form.append("organisation", item.organisation_id);
        form.append("order_id", order_id);

        try {
            const res = await fetch(backendUrl + "scrap-request/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`,
                },
                body: form
            });

            if (res.status === 201) {
                alert("Request submitted successfully!");
                setFormData({
                    item_type: '',
                    date: '',
                    phone: '',
                    weight: '',
                    image: ''
                });
                window.location.href = "/e-facility";
            } else if (res.status === 403) {
                alert("You are not authorized");
                window.location.reload();
            } else {
                const result = await res.json();
                alert("Error: " + JSON.stringify(result));
            }
        } catch (err) {
            console.error("Error submitting request:", err);
        }

        setLoading(false);
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", margin: "20%" }}>
                <img src={loaderGIF} alt="Loading..." style={{ width: "70px" }} />
                <p>Loading...</p>
            </div>
        );
    }

    return item?.organisation_name ? (
        <div className="recycleform">
            <h1>{item.organisation_name.toUpperCase()}</h1>
            <form onSubmit={handleSubmit}>
                <div className="row-1">
                    <div className="recycle-form-col-1">
                        <label>Select item type*</label>
                        <select name="item_type" required value={formData.item_type} onChange={handleChange}>
                            <option value="">Select type</option>
                            <option value="paper">Paper</option>
                            <option value="iron">Iron</option>
                            <option value="copper">Copper</option>
                            <option value="ewaste">E-waste</option>
                            <option value="plastic">Plastic</option>
                        </select>
                    </div>
                    <div className="recycle-form-col-1">
                        <label>Select Date of pickup*</label>
                        <input type="date" name="date" required value={formData.date} onChange={handleChange} />
                    </div>
                </div>

                <div className="row-2">
                    <div className="recycle-form-col-1">
                        <label>Phone number*</label>
                        <input type="tel" name="phone" pattern="[0-9]{10}" required value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="recycle-form-col-1">
                        <label>Scrap weight*</label>
                        <input type="number" name="weight" required value={formData.weight} onChange={handleChange} />
                    </div>
                </div>

                <div className="row-3">
                    <div className="recycle-form-col-1">
                        <label>Upload items image</label>
                        <input type="file" name="image" required onChange={handleChange} />
                    </div>
                </div>

                <input type="submit" value="SUBMIT" id="recycle-btn" />
            </form>
        </div>
    ) : (
        <div className="loader">
            <img src={loaderGIF} alt="Loading..." />
            <br />
            Please log in or wait a few seconds...
        </div>
    );
};

export default Recycle_Form;
