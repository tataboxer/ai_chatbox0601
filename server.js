const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 添加这行来提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

require('dotenv').config();
const ARK_API_KEY = process.env.ARK_API_KEY;

app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post(
            'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
            {
                model: 'ep-20250530165354-9lfhk',
                messages: req.body.messages,
                temperature: 0.7,
                stream: true
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ARK_API_KEY}`
                },
                timeout: 60000,
                responseType: 'stream' // 确保 axios 返回原始的响应流
            }
        );
        // 设置响应头，以便前端可以处理流式数据
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 将 Axios 响应流直接转发给客户端
        response.data.pipe(res);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});