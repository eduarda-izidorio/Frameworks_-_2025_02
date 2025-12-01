const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabaseClient');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Finance System API Running');
});

// ==================== TRANSACTIONS ENDPOINTS ====================

// GET /transactions
app.get('/transactions', async (req, res) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /transactions
app.post('/transactions', async (req, res) => {
    const { description, amount, type, category, date } = req.body;
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ description, amount, type, category, date }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PUT /transactions/:id
app.put('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount, type, category, date } = req.body;
    const { data, error } = await supabase
        .from('transactions')
        .update({ description, amount, type, category, date })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE /transactions/:id
app.delete('/transactions/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

// ==================== CATEGORIES ENDPOINTS ====================

// GET /categories
app.get('/categories', async (req, res) => {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST /categories
app.post('/categories', async (req, res) => {
    const { name, type } = req.body;
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, type }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PUT /categories/:id
app.put('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type } = req.body;
    const { data, error } = await supabase
        .from('categories')
        .update({ name, type })
        .eq('id', id)
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE /categories/:id
app.delete('/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
