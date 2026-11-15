const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


app.post('/api/billing', function (req, res) {
    const newBilling = req.body;

    fs.readFile('billing.json', 'utf8', function (err, data) {
        let billingList = [];
        if (!err && data) {
            billingList = JSON.parse(data);
        }
        billingList.push(newBilling);

        fs.writeFile('billing.json', JSON.stringify(billingList, null, 2), function (writeErr) {
            if (writeErr) {
                return res.status(500).json({ message: 'Error saving billing details.' });
            }
            res.json({ message: 'Billing details saved successfully!' });
        });
    });
});

app.listen(PORT, function () {
    console.log('Server running on http://localhost:' + PORT);
});