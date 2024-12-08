import axios from 'axios'; 
import CryptoJS from 'crypto-js'; 
import moment from 'moment'; 

const config = {
    app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const embed_data = {};

const items = [
    {
        id: "item1",
        name: "Sản phẩm 1",
        price: 29000000
    }
];

export async function createPayment(req, res) {
    try {
        const transID = Math.floor(Math.random() * 1000000);
        const order = {
            app_id: config.app_id,
            app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
            app_user: "user123",
            app_time: Date.now(), 
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: 24990000, 
            description: `Thanh toán cho sản phẩm #${transID}`,
            bank_code: "zalopayapp",
        };

        const data = `${config.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;
        order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        console.log('Order Data:', order);

        const response = await axios.post(config.endpoint, null, { params: order });

        if (response.data.return_code === 1) {
            console.log('Body:', response.data);
            res.send(response.data);
        } else {
            console.log('Error:', response.data);
            res.status(500).send(response.data);
        }
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).json({ error: 'Lỗi không xác định' });
    }
}