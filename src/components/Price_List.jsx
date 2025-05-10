import React from 'react';

const Price_List = () => {
  const scrapMaterials = [
    { name: "Newspaper", price: 10 },
    { name: "Books", price: 8 },
    { name: "Carton", price: 3 },
    { name: "Plastic", price: 6 },
    { name: "Hard Plastic", price: 2 },
    { name: "Iron", price: 22 },
    { name: "Tin", price: 16 },
    { name: "Aluminium", price: 100 },
    { name: "Aluminium Wires", price: 120 },
    { name: "Stainless Steel", price: 40 },
    { name: "Copper", price: 400 },
    { name: "Copper Wires", price: 450 },
    { name: "Brass", price: 300 },
    { name: "Mix Waste", price: 6 },
    { name: "Vehicle Tyre", price: 4 },
    { name: "Electronic Waste", price: 250 },
    { name: "Battery Scrap", price: 150 },
    { name: "Glass Bottles", price: 2 },
    { name: "Beverage Cans", price: 12 },
    { name: "Shredded Paper", price: 5 },
    { name: "Wooden Scrap", price: 3 },
    { name: "Computer Scrap", price: 200 },
    { name: "Brass Wires", price: 320 },
    { name: "Radiators", price: 180 },
    { name: "Lead Scrap", price: 130 },
    { name: "Steel Scrap", price: 50 },
    { name: "Foil Paper", price: 1 },
    { name: "Rubber Scrap", price: 20 },
    { name: "Zinc Scrap", price: 180 },
    { name: "Silver Scrap", price: 700 },
    { name: "Gold Scrap", price: 4800 },
    { name: "Plastic Bottles", price: 7 },
    { name: "Metal Wires", price: 90 },
    { name: "Household Appliances Scrap", price: 140 },
  ];

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f4f4f4",
      margin: 0,
      padding: "20px"
    }}>
      <div style={{
        width: "85%",
        margin: "0 auto",
        background: "white",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px"
      }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>
          Scrap Material Price List
        </h2>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "white",
                textTransform: "uppercase",
                textAlign: "left"
              }}>Material</th>
              <th style={{
                padding: "12px",
                backgroundColor: "#007bff",
                color: "white",
                textTransform: "uppercase",
                textAlign: "left"
              }}>Price (₹ per KG)</th>
            </tr>
          </thead>
          <tbody>
            {scrapMaterials.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd", cursor: "default" }}>
                <td style={{ padding: "12px" }}>{item.name}</td>
                <td style={{ padding: "12px", fontWeight: "bold", color: "#28a745" }}>
                  ₹{item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Price_List;
