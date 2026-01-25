import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useCustomers() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) console.error('Error fetching customers:', error);
        else setCustomers(data || []);
    }

    const addCustomer = async (customer) => {
        const tempId = crypto.randomUUID();
        const newCustomer = { ...customer, id: tempId };
        setCustomers(prev => [...prev, newCustomer]);

        const { data, error } = await supabase
            .from('customers')
            .insert([customer])
            .select();

        if (error) {
            console.error('Error adding customer:', error);
            setCustomers(prev => prev.filter(c => c.id !== tempId));
        } else {
            setCustomers(prev => prev.map(c => c.id === tempId ? data[0] : c));
        }
    };

    const updateCustomer = async (id, updates) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));

        const { error } = await supabase
            .from('customers')
            .update(updates)
            .eq('id', id);

        if (error) console.error('Error updating customer:', error);
    };

    const deleteCustomer = async (id) => {
        setCustomers(prev => prev.filter(c => c.id !== id));

        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) console.error('Error deleting customer:', error);
    };

    return { customers, addCustomer, updateCustomer, deleteCustomer };
}
