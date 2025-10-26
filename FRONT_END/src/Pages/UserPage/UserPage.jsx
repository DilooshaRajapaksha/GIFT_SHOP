import React from "react";
import { Link } from "react-router-dom";

import Box from "../../Components/Box/Box";

function UserPage() {
  return (
    <>
      <Box> 
        <h1>Welcome to GiftShop</h1>
        <p>Browse products here...</p>

        <Link to="/profile">
          <button style={{ marginTop: "20px" }}>Go to Profile</button>
        </Link>
      </Box>
    </>
  );
}

export default UserPage;