import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "../components/CartSidebar.jsx";
import Toast from "../components/Toast.jsx";
import { apiGet } from "../services/apiClient.js";
import "../styles/test_packages.css";

const Diagnostics = () => {
  const [tests, setTests] = useState([]);
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    const loadTests = async () => {
      try {
        const response = await apiGet("/diagnostics/tests");
        if (!mounted) return;
        setTests(response.data.tests || []);
      } catch (_error) {
        if (!mounted) return;
        setTests([]);
      }
    };
    loadTests();
    return () => {
      mounted = false;
    };
  }, []);

  const add = (item) => {
    setCart((prev) => {
      const ex = prev.find((p) => p.id === item.id);
      if (ex) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
    setToast(true);
    setTimeout(() => setToast(false), 1200);
  };

  const increaseQty = (id) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.qty, 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, i) => sum + i.qty, 0), [cart]);
  const getQty = (id) => cart.find((item) => item.id === id)?.qty || 0;

  return (
    <div className="page-fade">
      <div className="record-head">
        <h2>Diagnostic Tests</h2>
        {totalItems > 0 ? (
          <button className="btn-primary icon-btn cart-summary-btn" onClick={() => setOpen(true)}>
            <span aria-hidden="true">ðŸ§ª</span>
            <span>View Cart ({totalItems})</span>
            <strong>INR {total}</strong>
          </button>
        ) : null}
      </div>
      <div className="product-grid">
        {tests.map((test) => (
          <article key={test.id} className="panel product-card">
            <h3>{test.name}</h3>
            <p>{test.type}</p>
            <h4>INR {test.price}</h4>
            {getQty(test.id) > 0 ? (
              <div className="card-qty-wrap">
                <button className="qty-btn" onClick={() => decreaseQty(test.id)} aria-label={`Decrease ${test.name}`}>-</button>
                <span className="qty-value">{getQty(test.id)}</span>
                <button className="qty-btn" onClick={() => increaseQty(test.id)} aria-label={`Increase ${test.name}`}>+</button>
                <button className="remove-link" onClick={() => removeItem(test.id)}>Remove</button>
              </div>
            ) : (
              <button className="btn-ghost icon-btn" onClick={() => add(test)}>
                <span aria-hidden="true">ï¼‹</span>
                <span>Add to Cart</span>
              </button>
            )}
          </article>
        ))}
      </div>
      {totalItems > 0 && !open ? (
        <button className="btn-primary floating-cart-btn icon-btn" onClick={() => setOpen(true)}>
          <span aria-hidden="true">ðŸ§º</span>
          <span>{totalItems} item{totalItems > 1 ? "s" : ""} Â· INR {total}</span>
        </button>
      ) : null}
      <CartSidebar
        open={open}
        title="Diagnostics Cart"
        items={cart}
        total={total}
        onClose={() => setOpen(false)}
        onCheckout={() => navigate("/patient/diagnostics/checkout", { state: { total, items: cart } })}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
      />
      <Toast open={toast} message="Added to cart." />
    </div>
  );
};

export default Diagnostics;



