import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSales() {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        fetchSales();
    }, []);

    async function fetchSales() {
        const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('date', { ascending: false });

        if (error) console.error('Error fetching sales:', error);
        else setSales(data || []);
    }

    const addSale = async (saleData) => {
        // Format JSON items properly for Supabase
        const saleToInsert = {
            date: new Date().toISOString(),
            total: saleData.total,
            total_cost: saleData.totalCost,
            customer_id: saleData.customerId || null,
            items: saleData.items
        };

        const tempId = crypto.randomUUID();
        setSales(prev => [{ ...saleToInsert, id: tempId }, ...prev]);

        const { data, error } = await supabase
            .from('sales')
            .insert([saleToInsert])
            .select();

        if (error) {
            console.error('Error registering sale:', error);
            setSales(prev => prev.filter(s => s.id !== tempId));
        } else {
            setSales(prev => prev.map(s => s.id === tempId ? data[0] : s));
        }
    };

    const deleteSale = async (id) => {
        setSales(prev => prev.filter(s => s.id !== id));

        const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting sale:', error);
    };

    return { sales, addSale, deleteSale };
}
