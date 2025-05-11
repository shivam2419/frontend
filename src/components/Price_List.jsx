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
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "20px" }}>
      <style>
        {`
          @media (max-width: 768px) {
            .responsive-table {
              display: none;
            }
            .card-list {
              display: block;
            }
          }

          @media (min-width: 769px) {
            .card-list {
              display: none;
            }
          }
        `}
      </style>

      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        background: "white",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px"
      }}>
        <h2 style={{ textAlign: "center", color: "#333" }}>
          Scrap Material Price List
        </h2>

        {/* Desktop Table */}
        <table className="responsive-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr>
              <th style={{ padding: "12px", backgroundColor: "#007bff", color: "white", textAlign: "left" }}>Material</th>
              <th style={{ padding: "12px", backgroundColor: "#007bff", color: "white", textAlign: "left" }}>Price (₹/KG)</th>
            </tr>
          </thead>
          <tbody>
            {scrapMaterials.map((item, index) => (
              <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "12px" }}>{item.name}</td>
                <td style={{ padding: "12px", fontWeight: "bold", color: "#28a745" }}>₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="card-list">
          {scrapMaterials.map((item, index) => (
            <div key={index} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#fafafa"
            }}>
              <span style={{ fontWeight: "bold", color: "#007bff" }}>{item.name}</span>
              <span style={{ color: "#28a745", fontWeight: "bold" }}>₹{item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Price_List;
