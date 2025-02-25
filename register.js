function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = password.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash.toString(16);
}

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword!== confirmPassword) {
        alert('两次输入的密码不一致，请重新输入！');
        return;
    }

    // 获取已有的用户数据
    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[newUsername]) {
        alert('该用户名已存在，请选择其他用户名！');
        return;
    }

    const hashedPassword = hashPassword(newPassword);
    users[newUsername] = hashedPassword;

    // 保存更新后的用户数据到本地存储
    localStorage.setItem('users', JSON.stringify(users));

    alert('注册成功！请登录');
    window.location.href = 'login.html';
});