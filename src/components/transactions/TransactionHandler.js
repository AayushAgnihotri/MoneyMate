const handleAddTransaction = async (transactionData) => {
    try {
        await axios.post('/api/transactions', transactionData);
        notify('New transaction added successfully!', 'success');
    } catch (error) {
        notify('Failed to add transaction.', 'error');
    }
}; 