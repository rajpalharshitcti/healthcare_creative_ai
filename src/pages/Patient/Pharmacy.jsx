import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartSidebar from "../../components/CartSidebar.jsx";
import Toast from "../../components/Toast.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/pharmacy.css";

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        const response = await apiGet("/pharmacy/products");
        if (!mounted) return;
        setProducts(response.data.medicines || []);
      } catch (_error) {
        if (!mounted) return;
        setProducts([]);
      }
    };
    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  const addToCart = (item) => {
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
        <h2>Pharmacy</h2>
        {totalItems > 0 ? (
          <button className="btn-primary icon-btn cart-summary-btn" onClick={() => setOpen(true)}>
            <span aria-hidden="true">🛒</span>
            <span>View Cart ({totalItems})</span>
            <strong>INR {total}</strong>
          </button>
        ) : null}
      </div>
      <div className="product-grid">
        {products.map((item) => (
          <article key={item.id} className="panel product-card">
            <h3>{item.name}</h3>
            <p>{item.category}</p>
            <h4>INR {item.price}</h4>
            {getQty(item.id) > 0 ? (
              <div className="card-qty-wrap">
                <button className="qty-btn" onClick={() => decreaseQty(item.id)} aria-label={`Decrease ${item.name}`}>-</button>
                <span className="qty-value">{getQty(item.id)}</span>
                <button className="qty-btn" onClick={() => increaseQty(item.id)} aria-label={`Increase ${item.name}`}>+</button>
                <button className="remove-link" onClick={() => removeItem(item.id)}>Remove</button>
              </div>
            ) : (
              <button className="btn-ghost icon-btn" onClick={() => addToCart(item)}>
                <span aria-hidden="true">＋</span>
                <span>Add to Cart</span>
              </button>
            )}
          </article>
        ))}
      </div>
      {totalItems > 0 && !open ? (
        <button className="btn-primary floating-cart-btn icon-btn" onClick={() => setOpen(true)}>
          <span aria-hidden="true">🛍️</span>
          <span>{totalItems} item{totalItems > 1 ? "s" : ""} · INR {total}</span>
        </button>
      ) : null}
      <CartSidebar
        open={open}
        title="Medicine Cart"
        items={cart}
        total={total}
        onClose={() => setOpen(false)}
        onCheckout={() => navigate("/patient/pharmacy/checkout", { state: { total, items: cart } })}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeItem}
      />
      <Toast open={toast} message="Added to cart." />
    </div>
  );
};

export default Pharmacy;
