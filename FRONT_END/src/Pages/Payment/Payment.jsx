import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutTabs from "../../components/Checkout/CheckoutTabs";
import "../../components/Checkout/Checkout.css";

function Payment() {
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [deliveryData, setDeliveryData] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [slipFile, setSlipFile] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [uploading, setUploading] = useState(false);

  const deliveryCharge = 400; 
  const grandTotal = parseFloat(subtotal) + deliveryCharge;
  const API_BASE = 'http://localhost:8082/api/orders';

  useEffect(() => {
    const savedSubtotal = localStorage.getItem('subtotal') || 0;
    const savedDelivery = localStorage.getItem('delivery');
    const savedCart = localStorage.getItem('cart');
    setSubtotal(parseFloat(savedSubtotal));
    setDeliveryData(savedDelivery ? JSON.parse(savedDelivery) : {});
    setCartItems(savedCart ? JSON.parse(savedCart) : []);

    setTransactionRef(`GIFT-ORDER-${Date.now()}`);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File too large! Max 5MB.');
      return;
    }
    if (file && !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Only JPG/PNG allowed.');
      return;
    }
    setSlipFile(file);
  };

  const handlePay = async () => {
    if (!slipFile) {
      alert('Please upload payment slip!');
      return;
    }

    setUploading(true);
    const userId = 1; 

    try {

      const formData = new FormData();
      formData.append('slip', slipFile);

      const uploadRes = await fetch('${API_BASE}/upload-slip', {
        method: 'POST',
        body: formData,
      });
      const { slipPath } = await uploadRes.json();

      const orderData = {
        userId,
        deliveryAddress: deliveryData.address,
        deliveryCity: deliveryData.city,
        deliveryPostalCode: deliveryData.postalCode,
        totalPrice: grandTotal,
      };

      await fetch('${API_BASE}/create-from-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      alert(`Order created! Ref: ${transactionRef}. Check email for confirmation.`);
      localStorage.removeItem('cart');
      localStorage.removeItem('delivery');
      localStorage.removeItem('subtotal');
      navigate('/shop'); 
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="payment-page">
      <CheckoutTabs />
      <div className="tab-content">
        <h1>Payment</h1>
        
        <div className="bank-details">
          <h4>Bank Transfer Details (Manual Payment)</h4>
          <p><strong>Account Name:</strong> Gift Box Shop</p>
          <p><strong>Account Number:</strong> 123456789012</p>
          <p><strong>IFSC Code:</strong> SBIN0001234</p>
          <p><strong>Bank:</strong>Bank of Ceylon</p>
          <p><em>Transfer Rs {grandTotal} and upload slip below.</em></p>
        </div>

        <div className="transaction-ref">
          Transaction Reference: {transactionRef}
        </div>

        <div className="total-section">
          <p>Subtotal: Rs {subtotal}</p>
          <p>Delivery Charge: Rs {deliveryCharge}</p>
          <h3>Grand Total: Rs {grandTotal}</h3>
        </div>

        <div className="file-upload">
          <label>Upload Payment Slip (JPG/PNG):</label>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleFileChange} />
          {slipFile && <p>Selected: {slipFile.name}</p>}
        </div>

        <button onClick={handlePay} className="pay-btn" disabled={uploading}>
          {uploading ? 'Processing...' : 'Submit Payment'}
        </button>
      </div>
    </div>
  );
}

export default Payment;