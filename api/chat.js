export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // 调用讯飞星火官方接口，补全完整路径
    const response = await fetch('https://maas-api.cn-huabei-1.xf-yun.com/v2/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 从环境变量读取API密钥，前端完全看不到
        'Authorization': `Bearer ${process.env.XFYUN_API_KEY}`
      },
      body: JSON.stringify({
        model: 'xop3qwen1b7', // 讯飞免费版模型名，不能写gpt-3.5-turbo
        messages: messages,
        stream: false
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error', detail: error.message });
  }
}