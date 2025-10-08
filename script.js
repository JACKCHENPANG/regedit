// 配置您的云函数URL（需要替换为实际地址）
const API_URL = 'https://your-function-url.service.tcloudbase.com/submit';

document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
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
    
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        showResult('请输入正确的手机号', 'error');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        showResult('请输入正确的邮箱地址', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = '提交中...';
        
        // 发送数据到云函数
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showResult('✅ 信息提交成功！', 'success');
            document.getElementById('userForm').reset();
        } else {
            showResult('❌ 提交失败：' + (result.message || '请重试'), 'error');
        }
    } catch (error) {
        showResult('❌ 网络错误，请检查连接', 'error');
    } finally {
        const submitBtn = document.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.textContent = '提交信息';
    }
});

function showResult(message, type) {
    const resultEl = document.getElementById('result');
    resultEl.textContent = message;
    resultEl.className = 'result ' + type;
    
    // 3秒后自动隐藏
    setTimeout(() => {
        resultEl.textContent = '';
        resultEl.className = 'result';
    }, 3000);
}
