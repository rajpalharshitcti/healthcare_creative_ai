import React from "react";

const CartSidebar = ({
  open,
  title,
  items,
  total,
  onClose,
  onCheckout,
  onIncrease,
  onDecrease,
  onRemove
}) => {
  if (!open) return null;

  return (
    <aside className="cart-sidebar">
      <div className="cart-head">
        <h3>{title}</h3>
        <button className="btn-ghost" onClick={onClose}>Close</button>
      </div>
      <div className="cart-items">
        {items.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item-row">
              <div>
                <p className="cart-item-name">{item.name}</p>
                <small>INR {item.price} x {item.qty}</small>
              </div>
              <div className="cart-item-actions">
                <button type="button" className="qty-btn" onClick={() => onDecrease(item.id)}>-</button>
                <span className="qty-value">{item.qty}</span>
                <button type="button" className="qty-btn" onClick={() => onIncrease(item.id)}>+</button>
                <button type="button" className="remove-link" onClick={() => onRemove(item.id)}>Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart-foot">
        <h4>Total: INR {total}</h4>
        <button className="btn-primary" onClick={onCheckout} disabled={items.length === 0}>Checkout</button>
      </div>
    </aside>
  );
};

export default CartSidebar;
