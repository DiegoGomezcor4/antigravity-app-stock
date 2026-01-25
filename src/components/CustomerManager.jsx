import { useState } from 'react';

export function CustomerManager({ customers, onAdd, onUpdate, onDelete }) {
    const defaultState = { name: '', contact: '', email: '' };
    const [formData, setFormData] = useState(defaultState);
    const [editingId, setEditingId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        if (editingId) {
            onUpdate(editingId, formData);
            setEditingId(null);
        } else {
            onAdd(formData);
        }
        setFormData(defaultState);
    };

    const startEdit = (customer) => {
        setFormData({
            name: customer.name,
            contact: customer.contact || '',
            email: customer.email || ''
        });
        setEditingId(customer.id);
    };

    const cancelEdit = () => {
        setFormData(defaultState);
        setEditingId(null);
    };

    return (
        <div className="customer-manager">
            <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: editingId ? '1px solid var(--color-primary)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>{editingId ? 'Editar Cliente' : 'Registrar Cliente'}</h2>
                    {editingId && <button type="button" onClick={cancelEdit} className="btn-danger-outline">Cancelar</button>}
                </div>

                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Teléfono:</label>
                        <input
                            type="text"
                            value={formData.contact}
                            onChange={e => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <button className="btn btn-primary">{editingId ? 'Actualizar' : 'Guardar Cliente'}</button>
            </form>

            <div className="customers-list">
                <h3>Lista de Clientes ({customers.length})</h3>
                {customers.map(customer => (
                    <div key={customer.id} className="card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{customer.name}</strong>
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                {customer.contact} {customer.email && `• ${customer.email}`}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-icon" onClick={() => startEdit(customer)} style={{ fontSize: '1rem', width: 'auto', padding: '0 0.5rem' }}>✏️</button>
                            <button className="btn-danger-outline" onClick={() => onDelete(customer.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
