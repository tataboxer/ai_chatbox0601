// 导入必要的模块
const axios = require('axios');

// 导出处理函数
export default async function handler(req, res) {
    console.log('收到API请求，方法:', req.method);
    console.log('请求头:', req.headers);
    
    // 只处理 POST 请求
    if (req.method !== 'POST') {
        console.log('拒绝非POST请求');
        return res.status(405).json({ error: '只支持 POST 请求' });
    }

    try {
        // 从环境变量获取 API 密钥
        const ARK_API_KEY = process.env.ARK_API_KEY;
        console.log('ARK_API_KEY:', ARK_API_KEY ? '已配置' : '未配置');
        
        if (!ARK_API_KEY) {
            console.error('错误: ARK_API_KEY 未配置');
            return res.status(500).json({ 
                error: '服务器配置错误',
                details: 'ARK_API_KEY 未配置'
            });
        }

        console.log('准备请求火山豆包API');
        const apiUrl = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
        const requestData = {
            model: 'ep-20250530165354-9lfhk',
            messages: req.body.messages,
            temperature: 0.7,
            stream: true
        };
        
        console.log('请求数据:', JSON.stringify(requestData, null, 2));
        
        // 发送请求到 ARK API
        const response = await axios.post(
            apiUrl,
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ARK_API_KEY}`
                },
                timeout: 60000,
                responseType: 'stream'
            }
        );
        
        console.log('请求成功，状态码:', response.status);
        console.log('响应头:', response.headers);

        // 设置响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // 将 Axios 响应流直接转发给客户端
        response.data.pipe(res);
    } catch (error) {
        console.error('请求失败:', error.message);
        if (error.response) {
            console.error('响应数据:', error.response.data);
            console.error('响应状态码:', error.response.status);
            console.error('响应头:', error.response.headers);
        }
        
        res.status(500).json({ 
            error: '服务器内部错误',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}