export function SalesReport({ sales, onVoid }) {
    const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
    // Fix: Read total_cost (DB) or totalCost (fallback)
    const totalCost = sales.reduce((acc, sale) => acc + (sale.total_cost || sale.totalCost || 0), 0);
    const totalProfit = totalSales - totalCost;
    const marginPercent = totalSales ? ((totalProfit / totalSales) * 100).toFixed(1) : 0;

    return (
        <div className="sales-report">
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Ventas Totales</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>${totalSales.toFixed(2)}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Ganancia Estimada</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>${totalProfit.toFixed(2)}</p>
                </div>
                <div className="card" style={{ textAlign: 'center' }}>
                    <h3 style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Margen Promedio</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{marginPercent}%</p>
                </div>
            </div>

            <div className="card">
                <h3>Historial de Ventas</h3>
                {sales.length === 0 ? (
                    <p style={{ color: 'var(--color-text-secondary)' }}>No hay ventas registradas aún.</p>
                ) : (
                    <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                                <th style={{ padding: '0.5rem' }}>Fecha</th>
                                <th style={{ padding: '0.5rem' }}>Items</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                                <th style={{ padding: '0.5rem' }}>Ganancia</th>
                                <th style={{ padding: '0.5rem' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => {
                                // Fix: Resolve cost for each row
                                const saleCost = sale.total_cost || sale.totalCost || 0;
                                const saleProfit = sale.total - saleCost;

                                return (
                                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem' }}>{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString()}</td>
                                        <td style={{ padding: '0.5rem' }}>{sale.items ? sale.items.length : 0} items</td>
                                        <td style={{ padding: '0.5rem' }}>${sale.total.toFixed(2)}</td>
                                        <td style={{ padding: '0.5rem', color: 'var(--color-success)' }}>
                                            {saleCost > 0 ? `$${saleProfit.toFixed(2)}` : '-'}
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <button className="btn-danger-outline" onClick={() => onVoid(sale)} style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem' }}>
                                                Anular
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
