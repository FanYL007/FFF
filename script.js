const form = document.getElementById('ratingForm');
const resultDiv = document.getElementById('result');
const summaryDiv = document.getElementById('summary');

// 从本地存储获取之前保存的记录
let allRatings = JSON.parse(localStorage.getItem('allRatings')) || [];

// 页面加载时显示汇总信息
function displaySummary() {
    let summaryHTML = '<h2>汇总信息</h2>';
    allRatings.forEach((rating, index) => {
        let gradeClass;
        if (rating.totalScore < 66) {
            gradeClass = 'grade-fail';
        } else if (rating.totalScore >= 66 && rating.totalScore <= 81) {
            gradeClass = 'grade-pass';
        } else if (rating.totalScore >= 82 && rating.totalScore <= 98) {
            gradeClass = 'grade-good';
        } else if (rating.totalScore >= 99 && rating.totalScore <= 109) {
            gradeClass = 'grade-excellent';
        } else {
            gradeClass = 'grade-perfect';
        }

        summaryHTML += `
            <div class="summary-item">
                <p class="date">日期：${rating.date}</p>
                <div class="score-grade">
                    <p>总分：${rating.totalScore} 分</p>
                    <p class="${gradeClass}">等级：${rating.grade}</p>
                </div>
                <p>今日特别表现：${rating.specialContent}</p>
                <p>明日改进建议：${rating.improvement}</p>
                <button class="delete-btn" data-index="${index}">删除</button>
            </div>
        `;
    });
    summaryDiv.innerHTML = summaryHTML;

    // 为删除按钮添加点击事件
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.dataset.index);
            const confirmDelete = confirm(`确定要删除 ${allRatings[index].date} 的记录吗？`);
            if (confirmDelete) {
                allRatings.splice(index, 1);
                localStorage.setItem('allRatings', JSON.stringify(allRatings));
                displaySummary();
            }
        });
    });
}

displaySummary();

form.addEventListener('submit', function (e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const respect = parseInt(document.getElementById('respect').value);
    const communication = parseInt(document.getElementById('communication').value);
    const interrupting = parseInt(document.getElementById('interrupting').value);
    const expression = parseInt(document.getElementById('expression').value);
    const persuasibility = parseInt(document.getElementById('persuasibility').value);
    const specialContent = document.getElementById('special-content').value;
    const special = parseInt(document.getElementById('special').value);
    const improvement = document.getElementById('improvement').value;

    // 输入验证
    if (isNaN(respect) || isNaN(communication) || isNaN(interrupting) || isNaN(expression) || isNaN(persuasibility) || isNaN(special)) {
        alert('请输入有效的分数！');
        return;
    }

    if (respect < 0 || respect > 20 || communication < 0 || communication > 20 || interrupting < 0 || interrupting > 20 || expression < 0 || expression > 20 || persuasibility < 0 || persuasibility > 20 || special < 0 || special > 10) {
        alert('输入的分数超出了限定范围！');
        return;
    }

    const totalScore = respect + communication + interrupting + expression + persuasibility + special;

    let grade;
    let gradeClass;
    if (totalScore < 66) {
        grade = '不及格';
        gradeClass = 'grade-fail';
    } else if (totalScore >= 66 && totalScore <= 81) {
        grade = '及格';
        gradeClass = 'grade-pass';
    } else if (totalScore >= 82 && totalScore <= 98) {
        grade = '良好';
        gradeClass = 'grade-good';
    } else if (totalScore >= 99 && totalScore <= 109) {
        grade = '优秀';
        gradeClass = 'grade-excellent';
    } else {
        grade = '非常棒';
        gradeClass = 'grade-perfect';
    }

    resultDiv.innerHTML = `
        <p>日期：${date}</p>
        <p>总分：${totalScore} 分</p>
        <p class="${gradeClass}">等级：${grade}</p>
        <p>今日特别表现：${specialContent}</p>
        <p>明日改进建议：${improvement}</p>
    `;

    // 检查是否有当日的记录，如果有则提示并覆盖
    const existingIndex = allRatings.findIndex(rating => rating.date === date);
    if (existingIndex!== -1) {
        if (confirm(`当日（${date}）已有记录，是否覆盖？`)) {
            allRatings[existingIndex] = {
                date: date,
                totalScore: totalScore,
                grade: grade,
                specialContent: specialContent,
                improvement: improvement
            };
        } else {
            return;
        }
    } else {
        allRatings.push({
            date: date,
            totalScore: totalScore,
            grade: grade,
            specialContent: specialContent,
            improvement: improvement
        });
    }

    // 将记录保存到本地存储
    localStorage.setItem('allRatings', JSON.stringify(allRatings));

    displaySummary();

    form.reset();
});