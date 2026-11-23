const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/products', function (req, res) {
    db.query('SELECT * FROM products', function (err, results) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/products', function (req, res) {
    const { product_code, name, price, image } = req.body;
    const sql = 'INSERT INTO products (product_code, name, price, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [product_code, name, price, image], function (err, result) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product added to MySQL!', id: result.insertId });
    });
});

app.put('/api/products/:id', function (req, res) {
    const { name, price } = req.body;
    const sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
    db.query(sql, [name, price, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product updated!' });
    });
});

app.delete('/api/products/:id', function (req, res) {
    db.query('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Product deleted!' });
    });
});

app.get('/api/billing', function (req, res) {
    db.query('SELECT * FROM billing ORDER BY created_at DESC', function (err, results) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/billing', function (req, res) {
    const { name, address, paymentMethod, totalAmount } = req.body;
    const cardLast4 = paymentMethod.cardNumber.slice(-4);
    const sql = 'INSERT INTO billing (full_name, address, card_last4, expiration, total_amount) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [name, address, cardLast4, paymentMethod.expiration, totalAmount || 359.00], function (err, result) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Billing details saved to MySQL!', id: result.insertId });
    });
});

app.put('/api/billing/:id', function (req, res) {
    const { address } = req.body;
    db.query('UPDATE billing SET address = ? WHERE id = ?', [address, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Billing address updated!' });
    });
});


app.delete('/api/billing/:id', function (req, res) {
    db.query('DELETE FROM billing WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Billing record deleted!' });
    });
});
app.get('/api/cart', function (req, res) {
    db.query('SELECT * FROM cart', function (err, results) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/cart', function (req, res) {
    const { productId, quantity } = req.body;
    const sql = 'INSERT INTO cart (product_id, quantity) VALUES (?, ?)';
    db.query(sql, [productId, quantity], function (err, result) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item added to cart!', id: result.insertId });
    });
});
app.put('/api/cart/:id', function (req, res) {
    const { quantity } = req.body;
    db.query('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Cart item updated!' });
    });
});
app.delete('/api/cart/:id', function (req, res) {
    db.query('DELETE FROM cart WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Item removed from cart!' });
    });
});
app.get('/api/returns', function (req, res) {
    db.query('SELECT * FROM returns ORDER BY created_at DESC', function (err, results) {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/returns', function (req, res) {
    const { orderId, name, email, selectedItem, condition, returnReason, additionalDetails } = req.body;
    const productName = selectedItem ? selectedItem.name : 'Unknown Product';
    const sql = 'INSERT INTO returns (order_id, full_name, email, product_name, product_condition, return_reason, additional_details) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [orderId, name, email, productName, condition, returnReason, additionalDetails], function (err) {
        if (err) return res.status(500).json({ message: 'Error saving return request.' });
        res.json({ message: 'Return request saved to MySQL!' });
    });
});
app.put('/api/returns/:id', function (req, res) {
    const { condition, returnReason, additionalDetails } = req.body;
    db.query('UPDATE returns SET product_condition = ?, return_reason = ?, additional_details = ? WHERE id = ?', [condition, returnReason, additionalDetails, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Return request updated!' });
    });
});
app.delete('/api/returns/:id', function (req, res) {
    db.query('DELETE FROM returns WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Return request deleted!' });
    });
});

app.listen(PORT, function () {
    console.log('Server running on http://localhost:' + PORT);
});