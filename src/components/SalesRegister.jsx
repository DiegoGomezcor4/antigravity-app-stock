import { useState } from 'react';

export function SalesRegister({ products, customers, onSell }) {
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [qty, setQty] = useState(1);

    const product = products.find(p => p.id === selectedProduct);

    const addToCart = (e) => {
        e.preventDefault();
        if (!product) return;

        // Check if enough stock
        if (product.quantity < qty) {
            alert('No hay suficiente stock');
            return;
        }

        setCart(prev => [...prev, {
            product,
            quantity: Number(qty),
            subtotal: product.price * qty,
            cost: product.cost * qty // Store cost snapshot for profit calc
        }]);

        setSelectedProduct('');
        setQty(1);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;

        const saleData = {
            customerId: selectedCustomer,
            items: cart,
            total: cart.reduce((acc, item) => acc + item.subtotal, 0),
            totalCost: cart.reduce((acc, item) => acc + (item.cost || 0), 0) // Track total cost
        };

        onSell(saleData);
        setCart([]);
        setSelectedCustomer('');
        alert('Venta registrada con éxito');
    };

    const grandTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

    return (
        <div className="sales-register card">
            <h2>Registrar Venta</h2>

            <div className="form-group">
                <label>Cliente (Opcional)</label>
                <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}>
                    <option value="">Consumidor Final</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <form onSubmit={addToCart} className="form-row" style={{ alignItems: 'end' }}>
                <div className="form-group" style={{ flex: 2 }}>
                    <label>Producto</label>
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} required>
                        <option value="">Seleccionar...</option>
                        {products.filter(p => p.quantity > 0).map(p => (
                            <option key={p.id} value={p.id}>{p.name} (${p.price}) - Stock: {p.quantity}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Cant.</label>
                    <input
                        type="number"
                        min="1"
                        max={product?.quantity || 999}
                        value={qty}
                        onChange={e => setQty(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="submit">Agregar</button>
                </div>
            </form>

            {/* Cart Preview */}
            {cart.length > 0 && (
                <div className="cart-preview" style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                    <h4>Carrito</h4>
                    <ul style={{ listStyle: 'none', marginBottom: '1rem' }}>
                        {cart.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                <span>{item.quantity}x {item.product.name}</span>
                                <span>${item.subtotal.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div style={{ textAlign: 'right', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                        Total: ${grandTotal.toFixed(2)}
                    </div>
                    <button onClick={handleCheckout} className="btn btn-primary" style={{ backgroundColor: 'var(--color-success)' }}>
                        CONFIRMAR VENTA
                    </button>
                </div>
            )}
        </div>
    );
}
