import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/recycle_form.css';
import loaderGIF from '../assets/loader.gif';

const Recycle_Form = () => {
    const backendUrl = "https://scrapbridge-api.onrender.com/api/";
    const { user_id } = useParams();
    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState(true);
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
                        "Authorization": `Bearer ${localStorage.getItem("access")}`, // Add the token here
                    },
                });
                if(res.status === 401 || res.status == 403) {
                    alert("Some error occured, please try again later");
                    window.href.location = 'login';
                }
                const data = await res.json();
                setItem(data);
                setLoading(false);
            } catch (err) {
                console.error("Scrap collector detail fetching error", err);
            }
        };

        fetchData();
    }, [user_id]);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);

    // Function to get the user's location
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, handleError);
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    // Function to show the user's position
    const showPosition = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
    };

    // Function to handle errors
    const handleError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('Providing location is important for this functionality.');
                break;
            case error.POSITION_UNAVAILABLE:
                alert('Location information is unavailable.');
                break;
            case error.TIMEOUT:
                alert('The request to get user location timed out.');
                break;
            case error.UNKNOWN_ERROR:
                alert('An unknown error occurred.');
                break;
            default:
                break;
        }
    };

    // Automatically request location when the component mounts
    useEffect(() => {
        getLocation();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const now = new Date();
        const order_id = `scrapbridge-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        const form = new FormData();
        form.append("item_type", formData.item_type);
        form.append("date", formData.date);
        form.append("phone", formData.phone);
        form.append("weight", formData.weight);
        form.append("image", formData.image);
        form.append("location", latitude + " " + longitude);
        form.append("user", localStorage.getItem('user_id'));  // User ID from local storage
        form.append("organisation", item.organisation_id);  // Organisation ID from selected item
        form.append("order_id", order_id);
        try {
            const res = await fetch(backendUrl + "scrap-request/", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("access")}`
                },
                body: form
            });
            const result = await res.json();
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
            }
            if (res.status === 403) {
                alert("You are not authorized");
                window.location.reload();
            }
        } catch (err) {
            console.error("Error:", err);
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
    return (
        <>
            {item?.organisation_name ? (
                <div className="recycleform">
                    <h1>{item.organisation_name.toUpperCase()}</h1>
                    <form action="" method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="row-1">
                            <div className="col-1">
                                <label>Select item type*</label>
                                <select name="item_type" id="brandSelect" required value={formData.item_type} onChange={handleChange}>
                                    <option value="">Select type</option>
                                    <option value="paper">Paper</option>
                                    <option value="iron">Iron</option>
                                    <option value="copper">Copper</option>
                                    <option value="ewaste">E-waste</option>
                                    <option value="plastic">Plastic</option>
                                </select>
                            </div>
                            <div className="col-1">
                                <label>Select Date of pickup*</label>
                                <input type="date" name="date" required value={formData.date} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row-2">
                            <div className="col-1">
                                <label>Phone number*</label>
                                <input type="tel" placeholder="0000" name="phone" pattern="[0-9]{10}" title="Enter 10 digit phone number" required value={formData.phone} onChange={handleChange} />

                            </div>
                            <div className="col-1">
                                <label>Scrap weight*</label>
                                <input type="number" placeholder="in grams" name="weight" required value={formData.weight} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row-3">
                            <div className="col-1">
                                <label>Upload items image</label>
                                <input type="file" name="image" required onChange={handleChange} />
                            </div>
                        </div>

                        <input id="latitude" name="latitude" type="hidden" value={latitude} />
                        <input id="longitude" name="longitude" type="hidden" value={longitude} />

                        <input type="submit" value="SUBMIT" id="recycle-btn" />
                    </form>
                </div>
            ) : (
                <div className="loader"><img src={loader} alt="" /><br />Check if you are logged-In or wait for few seconds</div>
            )}
        </>
    );
};

export default Recycle_Form;
