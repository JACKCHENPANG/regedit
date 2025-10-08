const API_URL = 'https://1304419785-1um55rrftj.ap-guangzhou.tencentscf.com';

document.getElementById('authorizationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const verificationSection = document.getElementById('verificationSection');
    const resultEl = document.getElementById('result');
    
    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        company: document.getElementById('company').value.trim(),
        school: document.getElementById('school').value.trim(),
        requestTime: new Date().toISOString(),
        type: 'software_authorization'
    };
    
    // 必填字段验证
    if (!formData.name || !formData.phone || !formData.email) {
        showResult('请填写所有必填字段', 'error');
        return;
    }
    
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        showResult('请输入正确的手机号', 'error');
        return;
    }
    
    try {
        // 显示加载状态
        submitBtn.disabled = true;
        submitBtn.textContent = '生成验证码中...';
        resultEl.style.display = 'none';
        
        // 调用云函数
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // 显示验证码区域
            document.getElementById('codeValue').textContent = result.data.verificationCode;
            verificationSection.style.display = 'block';
            
            // 添加复制功能
            document.getElementById('copyBtn').addEventListener('click', function() {
                navigator.clipboard.writeText(result.data.verificationCode).then(() => {
                    showResult('验证码已复制到剪贴板', 'success');
                });
            });
            
            showResult('验证码生成成功！', 'success');
        } else {
            showResult(`生成失败: ${result.message}`, 'error');
        }
        
    } catch (error) {
        showResult(`网络错误: ${error.message}`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '申请验证码';
    }
});

function showResult(message, type) {
    const resultEl = document.getElementById('result');
    const contentEl = document.getElementById('result-content');
    
    contentEl.innerHTML = message;
    resultEl.className = 'result ' + type;
    resultEl.style.display = 'block';
    
    setTimeout(() => {
        resultEl.style.display = 'none';
    }, 5000);
}
