// 导入必要的模块
const axios = require('axios');

// 导出处理函数
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '只支持 POST 请求' });
    }

    try {
        const ARK_API_KEY = process.env.ARK_API_KEY;
        if (!ARK_API_KEY) {
            console.error('ARK_API_KEY 未配置');
            return res.status(500).json({ 
                error: '服务器配置错误',
                details: 'ARK_API_KEY 未配置'
            });
        }

        // 发送请求到 ARK API
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
        console.error('API 请求详细错误:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        res.status(500).json({ 
            error: '服务器内部错误',
            details: error.message
        });
    }
}