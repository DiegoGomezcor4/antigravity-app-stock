import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function ProductForm({ onAdd, onUpdate, editingProduct, onCancelEdit }) {
    const defaultState = {
        name: '',
        quantity: '',
        price: '',
        cost: '',
        minStock: '5',
        image: '',
        description: ''
    };

    const [formData, setFormData] = useState(defaultState);

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name,
                quantity: editingProduct.quantity,
                price: editingProduct.price,
                cost: editingProduct.cost || '',
                minStock: editingProduct.min_stock || editingProduct.minStock || 5,
                image: editingProduct.image || '',
                description: editingProduct.description || ''
            });
        } else {
            setFormData(defaultState);
        }
    }, [editingProduct]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.quantity) return;

        const productData = {
            ...formData,
            quantity: Number(formData.quantity),
            price: Number(formData.price) || 0,
            cost: Number(formData.cost) || 0,
            minStock: Number(formData.minStock) || 0
        };

        if (editingProduct) {
            onUpdate(editingProduct.id, productData);
            toast.success('Producto actualizado');
        } else {
            onAdd(productData);
            toast.success('Producto agregado');
        }

        setFormData(defaultState);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMarginChange = (e) => {
        const marginValue = e.target.value;
        const cost = Number(formData.cost) || 0;

        if (!marginValue) {
            setFormData(prev => ({ ...prev, price: cost })); // If no margin, price equals cost
            return;
        }

        const marginPercent = Number(marginValue);
        const newPrice = cost * (1 + marginPercent / 100);

        setFormData(prev => ({
            ...prev,
            price: newPrice.toFixed(2) // Keep 2 decimal places
        }));
    };

    // Calculate current margin percent based on price and cost for display/default value
    // Formula: Margin% = ((Price - Cost) / Cost) * 100
    const cost = Number(formData.cost) || 0;
    const price = Number(formData.price) || 0;

    // Calculate display margin. 
    // If cost is 0, margin is technically infinite or undefined, define as 0 or 100 based on price? 
    // If price exists and cost is 0, it's 100% profit (infinite markup). Let's handle gracefully.
    const currentMarginPercent = (cost > 0 && price > 0)
        ? (((price - cost) / cost) * 100).toFixed(1)
        : (cost === 0 && price > 0 ? '100' : '0');

    const marginAmount = price - cost;

    return (
        <form onSubmit={handleSubmit} className="product-form card" style={editingProduct ? { border: '1px solid var(--color-primary)' } : {}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>{editingProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
                {editingProduct && (
                    <button type="button" onClick={onCancelEdit} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                        Cancelar
                    </button>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="name">Nombre Concepto</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: Laptop Gaming"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="image">URL de Imagen (Opcional)</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="quantity">Cantidad</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="minStock">Alerta Stock Mín.</label>
                    <input
                        type="number"
                        id="minStock"
                        name="minStock"
                        value={formData.minStock}
                        onChange={handleChange}
                        min="0"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="cost">Costo ($)</label>
                    <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="margin">Margen %</label>
                    <input
                        type="number"
                        id="margin"
                        name="margin"
                        value={currentMarginPercent}
                        onChange={handleMarginChange}
                        placeholder="%"
                        min="0"
                        step="0.1"
                        disabled={!formData.cost || Number(formData.cost) === 0}
                        title={(!formData.cost || Number(formData.cost) === 0) ? "Ingrese un costo primero" : ""}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Precio Venta ($)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            {(price > 0 || cost > 0) && (
                <div className="margin-info" style={{
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                }}>
                    <span>Ganancia Neta: <strong>${marginAmount.toFixed(2)}</strong></span>
                </div>
            )}

            <div className="form-group">
                <label htmlFor="description">Descripción (Opcional)</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                />
            </div>

            <button type="submit" className="btn btn-primary">
                {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
        </form>
    );
}
