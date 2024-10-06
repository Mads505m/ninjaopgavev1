require('dotenv').config();

const axios = require('axios');
const PORT = process.env.PORT || 8000;

const sendRequest = async (clientNumber) => {
    try {
        const response = await axios.get(`http://localhost:${PORT}/read-file`);
        console.log(`Client ${clientNumber}: `, response.data);
    } catch (error) {
        console.error(`Client ${clientNumber} Error: `, error.message);
    }
};

for (let i = 1; i <= 10; i++){
    sendRequest(i)
}