const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/investor/', require('./routes/investorRoute'));
app.use('/api/fund/', require('./routes/fundRoute'));
app.use('/api/sip/', require('./routes/sipRoute'));
app.listen(3000, () => {
    console.log("Server is running");
});