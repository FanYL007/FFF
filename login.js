function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        hash = password.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash.toString(16);
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const hashedPassword = hashPassword(password);

    // 获取已有的用户数据
    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] === hashedPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    } else {
        alert('用户名或密码错误');
    }
});