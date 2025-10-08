// 配置您的云函数URL
const API_URL = 'https://1304419785-1um55rrftj.ap-guangzhou.tencentscf.com';

document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('button[type="submit"]');
    const resultEl = document.getElementById('result');
    
    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        submitTime: new Date().toLocaleString('zh-CN')
    };
    
    // 基本验证
    if (!formData.name || !formData.phone || !formData.email) {
        showResult('请填写所有字段', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        resultEl.style.display = 'none';
        
        console.log('发送数据:', formData);
        
        // 发送请求到云函数
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('响应状态:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        // 直接解析JSON响应（不再处理blob）
        const result = await response.json();
        console.log('解析结果:', result);
        
        if (result.success) {
            showResult(`
                <h3>✅ 注册成功！</h3>
                <div style="margin-top: 15px;">
                    <p><strong>姓名：</strong>${result.data.name}</p>
                    <p><strong>手机：</strong>${result.data.phone}</p>
                    <p><strong>邮箱：</strong>${result.data.email}</p>
                    <p><strong>访问密钥：</strong><code style="background: #f5f5f5; padding: 2px 5px; border-radius: 3px;">${result.data.secretKey}</code></p>
                    <p><strong>提交时间：</strong>${result.data.submitTime}</p>
                </div>
                <p style="color: #666; font-size: 12px; margin-top: 10px;">
                    请妥善保管您的访问密钥
                </p>
            `, 'success');
            
            // 清空表单
            document.getElementById('userForm').reset();
        } else {
            showResult(`❌ ${result.message}`, 'error');
        }
        
    } catch (error) {
        console.error('请求错误:', error);
        showResult(`❌ 网络错误: ${error.message}`, 'error');
    } finally {
        // 恢复按钮状态
        submitBtn.disabled = false;
        submitBtn.textContent = '提交信息';
    }
});

function showResult(message, type) {
    const resultEl = document.getElementById('result');
    const contentEl = document.getElementById('result-content');
    
    contentEl.innerHTML = message;
    resultEl.className = 'result ' + type;
    resultEl.style.display = 'block';
    
    // 5秒后自动隐藏
    setTimeout(() => {
        resultEl.style.display = 'none';
    }, 5000);
}
