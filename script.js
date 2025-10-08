// 配置您的云函数URL
const API_URL = 'https://1304419785-1um55rrftj.ap-guangzhou.tencentscf.com';

async function submitForm() {
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        // 云函数返回的是JSON下载文件，需要特殊处理
        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onload = function() {
            const result = JSON.parse(reader.result);
            if (result.success) {
                showResult('✅ 提交成功！密钥：' + result.data.secretKey, 'success');
            } else {
                showResult('❌ ' + result.message, 'error');
            }
        };
        reader.readAsText(blob);
        
    } catch (error) {
        showResult('网络错误，请重试', 'error');
    }
}
