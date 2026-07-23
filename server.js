const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// السماح لموقعك بالاتصال بالباك إند
app.use(cors());

// مسار الـ Proxy الخاص بك
app.get('/api/get-video', async (req, res) => {
    try {
        // استقبال الـ subjectId أو الـ parameters من موقعك
        const { subjectId, se, ep, detailPath } = req.query;

        // الرابط الأصلي الذي أخرجناه من الـ Network
        const targetUrl = `https://movie-box.co/wefeed-h5api-bff/subject/play`;

        // إرسال الطلب من السيرفر الخاص بك إلى السيرفر المستهدف (مع إضافة الـ Headers إذا لزم الأمر)
        const response = await axios.get(targetUrl, {
            params: {
                subjectId,
                se,
                ep,
                detailPath,
                streamSignType: 1
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://movie-box.co/'
            }
        });

        // إرسال البيانات التي استقبلناها إلى موقعك
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'فشل في جلب البيانات من المصدر' });
    }
});

// مسار الـ Proxy لطلب الأفلام
app.get('/api/get-movies', async (req, res) => {
    try {
        const { tabId, page, perPage } = req.query;
        
        // الرابط الأصلي لقائمة الأفلام
        const targetUrl = `https://h5-api.aoneroom.com/wefeed-h5api-bff/subject/trending?tabId=${tabId || 'ONEROOM_MOVIE'}&page=${page || 1}&perPage=${perPage || 18}`;
        
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

// بدء السيرفر
app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
