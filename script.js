console.log("个人主页的 JavaScript 已加载")

const button = document.getElementById("theme-toggle"); //按照Id查找HTML元素

const savedTheme = localStorage.getItem("theme"); //读取保存的数据，如果未保存返回null

if(savedTheme == "dark"){//初始化页面
    document.body.classList.add("dark-mode");
}

function updateThemeButton(){
    if(document.body.classList.contains("dark-mode")){
        button.textContent = "切换浅色模式";
    }else{
        button.textContent = "切换深色模式";
    }

}

updateThemeButton();

button.addEventListener("click", function(){  //给按钮注册一个点击事件监听器。当用户点击按钮时，执行后面提供的函数。
    document.body.classList.toggle("dark-mode");//dark-mode被储存在body的classList里

    if(document.body.classList.contains("dark-mode")){/*contains() 用来检查 body 是否包含 dark-mode 这个类名。*/
        localStorage.setItem("theme", "dark"); //保存新选择
    }else{
        localStorage.setItem("theme", "light");
    }

    updateThemeButton();
});

/*
document.body：获取网页的 body 元素。
classList：访问这个元素的 CSS 类名列表。
toggle("dark-mode")：如果存在 dark-mode，就移除它；如果不存在，就添加它。
*/

//querySelector() 会根据 CSS 选择器找到第一个匹配的元素。
const cards = document.querySelectorAll(".project-card");

cards.forEach(function (card, index){ //循环进行展开
    // 设置每张卡片的过渡延迟
    card.style.setProperty(
        "--reveal-delay",
        `${index * 0.15}s`
    );

    // 获取当前卡片内部的按钮和详情区域
    const detailButton = card.querySelector(".detail-toggle");
    const projectDetails = card.querySelector(".project-details");

    // 绑定详情按钮事件
    detailButton.addEventListener("click",function(){
        projectDetails.hidden = !projectDetails.hidden;

        if(projectDetails.hidden){
            detailButton.textContent = "查看项目详情";
        }else{
            detailButton.textContent = "收起项目详情";
        }

    });
});

const copyButton = document.getElementById("copy-email");
const emailText = document.getElementById("email");
const copyMessage = document.getElementById("copy-message");

let toastTimer;
//async表示这是一个异步函数，让函数内部可以使用await等待异步操作，调用 async 函数会返回一个 Promise。
copyButton.addEventListener("click", async function () {//async 和 await 是 JavaScript 处理异步操作的常用方式
    try{//await等待异步操作(请求浏览器写入剪贴板）的完成，再继续执行后面的代码
            //await：在这个函数中等待某个 Promise 的结果。
            //等待原因：浏览器需要完成一次剪贴板写入，才能确定是否成功。我们不能假设每次调用都会立即成功，所以使用 try/catch 来处理可能发生的错误。
        await navigator.clipboard.writeText(emailText.textContent); //访问浏览器的剪贴板接口，将文字写入剪贴板（获取邮箱元素中的文字）
        showToast("邮箱已复制");//在修改页面上的提示文字，而不是弹出一个新窗口。
    } catch(error){
        console.error("复制失败：", error);
        showToast("复制失败，请手动复制");
    } 
});

function showToast(message){
    copyMessage.textContent = message;
    copyMessage.classList.add("show"); //显示提示框

    //如果连续点击，重新开始计时
    clearTimeout(toastTimer);

    toastTimer = setTimeout(function(){
        copyMessage.classList.remove("show"); //隐藏提示框
    }, 2000);
}

/* ===== 鼠标跟随光晕 ===== */
const cursorGlow = document.querySelector(".cursor-glow");

if(cursorGlow){
    document.addEventListener("pointermove", function(event){
        //获取鼠标在浏览器视口中的坐标
        const x = event.clientX;
        const y = event.clientY;

        //更新光晕的位置,.style访问这个元素内联的CSS样式，定位光晕盒子的左上角而非圆心
        cursorGlow.style.left = x + "px";
        cursorGlow.style.top = y + "px";
    })
}

const shineCards = document.querySelectorAll(".project-card");

shineCards.forEach(function(card){
    card.addEventListener("pointermove", function(event){
        //获取卡片在浏览器视口中的位置
        const rect = card.getBoundingClientRect();

        //计算鼠标在卡片内部的坐标
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", x + "px");
        card.style.setProperty("--mouse-y", y + "px");
    })
})

/* =====滚动显现动画 ===== */
const projectCards = document.querySelectorAll(".project-card");

const observer = new IntersectionObserver(
    function(entries, observer){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add("show");
                observer.unobserve(entry.target);//观察器不再监测当前这张卡片
            }
        });
    },
    {
        threshold: 0.15
    }
);


projectCards.forEach(function(card){//主动获取所有项目卡片
    observer.observe(card);
});

/* ===== 当前区域导航高亮 ===== */
/*返回NodeList；[href^="#"]：并且要求它的 href 属性是以 # 开头的。^=以指定内容开头*/
const navLinks = document.querySelectorAll('nav a[href^="#"]');


const sections = Array.from(navLinks) /*转换为真正数组*/
    .map(function (link) {/*map() 的作用是：把数组中的每一个元素转换成另一个元素，最后得到一个新的数组。*/
        return document.querySelector(link.getAttribute("href"));/*把#about转换成id="about" 的元素*/
    })
    .filter(function (section) { /*如果导航栏里写了不存在的部分，返回null*/
        return section !== null;
    });

function updateActiveNav(){
    //以视口顶部往下约35%的位置作为判断线.window.innerHeight,表示当前浏览器视口的高度。
    const marker = window.innerHeight * 0.35;//当某个区域的顶部越过这条线以后，就认为用户已经浏览到这个区域。

    let currentSection = sections[0];//let表示可修改

    sections.forEach(function(section){
        const rect = section.getBoundingClientRect();//返回这个 HTML 元素当前相对于浏览器视口的位置和尺寸

        if(rect.top <= marker){//遍历后最后部分顶部距离浏览器顶部雄安与marker
            currentSection = section;
        }
    });

    //只让当前区域对应导航链接拥有active类
    navLinks.forEach( function(link){
        const isActive = //返回bool
            link.getAttribute("href") === "#" + currentSection.id;
        
        link.classList.toggle("active", isActive);//isActive为true时添加，反之删除
    });
}
// 页面滚动时更新
window.addEventListener("scroll",updateActiveNav);
// 窗口大小变化时重新判断
window.addEventListener("resize",updateActiveNav);
// 页面初始化时判断一次
updateActiveNav();

/* ===== 漂浮粒子背景：第一步 ===== */

const particleCanvas = document.getElementById("particle-canvas");
const particleContext = particleCanvas.getContext("2d");

function resizeParticleCanvas(){
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeParticleCanvas();

window.addEventListener("resize",resizeParticleCanvas);
//记录鼠标位置
const mouse = {
    x : null,
    y : null,
    radius: 120
};

window.addEventListener("pointermove",function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

document.addEventListener("pointerleave",function(){
    mouse.x = null;
    mouse.y = null;
})



//暂时创建50个静态粒子
const particles = [];

for(let i = 0; i < 50; i++){
    particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        radius: Math.random() * 2 + 1,

        //每帧移动速度
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    });
}

function getDistance(x1, y1, x2, y2){
    const dx = x1 - x2;
    const dy = y1 - y2;

    return Math.sqrt(dx * dx + dy * dy);
}

//绘制所有粒子
function drawParticles(){
    particleContext.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );

    particles.forEach(function(particle){
        //默认速度
        let moveX = particle.vx;
        let moveY = particle.vy;

        //如果鼠标存在，计算鼠标的排斥作用
        if(mouse.x !== null && mouse.y !== null){
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;

            const distance = getDistance(
                particle.x,
                particle.y,
                mouse.x,
                mouse.y
            );

            if(distance < mouse.radius && distance > 0){
                //距离越近，排斥约明显
                const force = (mouse.radius - distance) / mouse.radius;

                moveX += (dx / distance) * force * 1.2; //dx / distance 和 dy / distance 表示从鼠标指向粒子的单位方向向量。我们沿着这个方向给粒子增加一点速度，就能让它远离鼠标。
                moveY += (dy / distance) * force * 1.2
            }
        }

        particle.x += moveX;
        particle.y += moveY;

        //如果超出画布，从另一侧出现
        if(particle.x < 0) particle.x = particleCanvas.width;
        if(particle.x > particleCanvas.width) particle.x = 0;
        if(particle.y < 0) particle.y = particleCanvas.height;
        if(particle.y > particleCanvas.height) particle.y = 0;
        
        particleContext.beginPath();
        particleContext.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        particleContext.fillStyle = "rgba(129, 140, 248, 0.65)";
        particleContext.fill();
    });

    //绘制距离较近的粒子之间的连接线
    for(let i = 0; i < particles.length; i++)
    {
        for(let j = i + 1; j < particles.length; j++){
            const p1 = particles[i];
            const p2 = particles[j];
        
            const distance = getDistance(
                p1.x,p1.y,
                p2.x,p2.y
            );

            if(distance < 120){
                const opacity = (1 - distance / 120) * 0.25;

                particleContext.beginPath();
                particleContext.moveTo(p1.x,p1.y);
                particleContext.lineTo(p2.x,p2.y);

                particleContext.strokeStyle = 
                    `rgba(129, 140, 248, ${opacity})`;

                    particleContext.lineWidth = 1;
                    particleContext.stroke();
            }
        }
    }




    //请求浏览器下一帧再调用这个函数
    requestAnimationFrame(drawParticles);

}

drawParticles();

/* ===== 隐藏彩蛋：打开与关闭弹窗 ===== */
const loveTrigger = document.getElementById("love-trigger");
const loveDialog = document.getElementById("love-dialog");
const loveClose = document.getElementById("love-close");

//点击心形，打开弹窗
loveTrigger.addEventListener("click",function(){
    loveDialog.hidden = false;
})
/*
loveClose.addEventListener("click",function(){
    loveDialog.hidden = true;
})


// 点击弹窗外部区域，关闭弹窗
loveDialog.addEventListener("click", function (event) {
    if (event.target === loveDialog) {
        loveDialog.hidden = true;
    }
});

document.addEventListener("keydown", function(event){
    if(event.key === "Escape" && !loveDialog.hidden){
        loveDialog.hidden = true;
    }
})
*/


/* ===== 隐藏彩蛋：剧情分支 ===== */

const loveOptions = document.querySelectorAll(".love-option");
const loveTitle = document.getElementById("love-dialog-title");
const loveMessage = document.querySelector(".win-dialog-message");
const loveFeedback = document.getElementById("love-feedback");

loveOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        const choice = option.dataset.choice;

        // 根据访客选择，进入不同剧情
        if (choice === "like") {
            loveTitle.textContent = "好感度 +100";
            loveMessage.textContent =
                "检测到正向反馈！感谢喜欢这个小小的个人主页。";
            loveFeedback.textContent =
                "SYSTEM MESSAGE: 今天的代码运行得格外顺利 ♥";

            finishNormalEnding();
        }

        else if (choice === "okay") {
            loveTitle.textContent = "收到中性反馈";
            loveMessage.textContent =
                "正在记录你的建议……希望下次更新能让你眼前一亮。";
            loveFeedback.textContent =
                "请选择：继续探索主页，或期待下一次版本更新。";
            finishNormalEnding();
        }

        else if (choice === "nope") {
            loveTitle.textContent = "警告：好感度系统异常";
            loveMessage.textContent =
                "检测到无法处理的负面反馈。正在尝试恢复系统……";
            loveFeedback.textContent =
                "ERROR CODE: LOVE_NOT_FOUND";

            startBugChaos();

        }

        // 选过之后，暂时隐藏三个选项，防止重复触发
        loveOptions.forEach(function (item) {
            item.hidden = true;
        });
    });
});


function finishNormalEnding() {
    // 创建一个返回主页按钮
    const returnButton = document.createElement("button");

    returnButton.type = "button";
    returnButton.className = "love-option";
    returnButton.textContent = "返回主页";

    loveFeedback.insertAdjacentElement("afterend", returnButton);

    returnButton.addEventListener("click", function () {
        loveDialog.hidden = true;

        // 恢复弹窗初始状态，方便再次体验彩蛋
        loveOptions.forEach(function (item) {
            item.hidden = false;
        });

        returnButton.remove();

        loveTitle.textContent = "检测到一个情感错误";
        loveMessage.textContent = "你觉得这个主页怎么样？";
        loveFeedback.textContent = "";
    });
}



/* ===== BUG 结局：生成重复报错窗口 ===== */


let bugTimer = null;

function startBugChaos() {
    const bugChaos = document.getElementById("bug-chaos");
    const container = document.getElementById("bug-window-container");

    // 防止重复启动
    if (bugTimer !== null) {
        return;
    }

    bugChaos.hidden = false;
    container.replaceChildren();
    startGlitchScreen();

    let count = 0;
    const maxWindows = 100;

    function createBugWindow() {
        // 达到数量上限，停止生成
        if (count >= maxWindows) {
            clearInterval(bugTimer);
            bugTimer = null;
            return;
        }

        const win = document.createElement("div");
        win.className = "bug-window";

        // 随机位置，避免窗口完全堆在一起
        const maxX = Math.max(0, window.innerWidth - 320);
        const maxY = Math.max(0, window.innerHeight - 120);

        win.style.left = Math.random() * maxX + "px";
        win.style.top = Math.random() * maxY + "px";

        // 标题栏
        const titlebar = document.createElement("div");
        titlebar.className = "bug-window-titlebar";

        const title = document.createElement("span");
        title.textContent = "System Error";

        const closeIcon = document.createElement("span");
        closeIcon.className = "bug-window-x";
        closeIcon.textContent = "×";
        closeIcon.setAttribute("aria-hidden", "true");

        titlebar.append(title, closeIcon);

        // 报错内容
        const body = document.createElement("div");
        body.className = "bug-window-body";

        const errorIcon = document.createElement("span");
        errorIcon.className = "bug-window-error";
        errorIcon.textContent = "✖";
        errorIcon.setAttribute("aria-hidden", "true");

        const message = document.createElement("span");
        message.textContent = "正在重新计算好感度……";

        body.append(errorIcon, message);
        win.append(titlebar, body);

        // 添加到页面，触发出现动画
        container.appendChild(win);

        count++;
    }

    // 先立即出现一个窗口
    createBugWindow();

    // 然后每隔 180ms 出现一个新窗口
    bugTimer = setInterval(createBugWindow, 60);

    // 故障持续 7 秒后，显示恢复选项
    setTimeout(function () {
        if (!bugChaos.hidden) {
            document.getElementById("bug-recovery").hidden = false;
        }
    }, 7000);
}



/* ===== 彩色雪花屏：矩形块逐渐变成噪点 ===== */

let glitchTimer = null;
let glitchResizeHandler = null;

function startGlitchScreen() {
    const canvas = document.getElementById("bug-static-canvas");
    const ctx = canvas.getContext("2d");

    // 防止重复启动
    if (glitchTimer !== null) {
        return;
    }

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // 使用较低的内部分辨率，降低绘制成本
    function resizeCanvas() {
        canvas.width = Math.ceil(window.innerWidth / 3);
        canvas.height = Math.ceil(window.innerHeight / 3);
    }

    resizeCanvas();

    glitchResizeHandler = resizeCanvas;
    window.addEventListener("resize", glitchResizeHandler);

    const startTime = performance.now();

    function drawGlitch() {
        const width = canvas.width;
        const height = canvas.height;

        // 计算故障进度：0 到 1
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / 7000, 1);

        ctx.clearRect(0, 0, width, height);

        // 深色底层，模拟显示信号异常
        ctx.fillStyle = "#101018";
        ctx.fillRect(0, 0, width, height);

        // 前期：少量大色块
        // 后期：更多小色块和密集噪点
        const blockCount = Math.floor(
            12 + progress * 100
        );

        for (let i = 0; i < blockCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            // 随着故障加重，色块尺寸逐渐缩小
            const maxSize = Math.max(
                2,
                90 * (1 - progress) + 3
            );

            const blockWidth =
                2 + Math.random() * maxSize;

            const blockHeight =
                2 + Math.random() * maxSize * 0.65;

            // 随机产生高饱和度 RGB 故障色
            const colors = [
                "#ff1744",
                "#00e5ff",
                "#76ff03",
                "#ff00e5",
                "#ffea00",
                "#651fff",
                "#ffffff"
            ];

            ctx.globalAlpha = 0.35 + Math.random() * 0.65;
            ctx.fillStyle =
                colors[Math.floor(Math.random() * colors.length)];

            ctx.fillRect(x, y, blockWidth, blockHeight);
        }

        // 后期逐渐形成密集的彩色雪花噪点
        const noiseCount = Math.floor(
            progress * 2200
        );

        for (let i = 0; i < noiseCount; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;

            const brightness = Math.random();

            if (brightness < 0.33) {
                ctx.fillStyle = "#ff304f";
            } else if (brightness < 0.66) {
                ctx.fillStyle = "#00e5ff";
            } else {
                ctx.fillStyle = "#ffffff";
            }

            ctx.globalAlpha = 0.35 + Math.random() * 0.65;
            ctx.fillRect(
                x,
                y,
                1 + Math.random() * 2,
                1 + Math.random() * 2
            );
        }

        // 随机水平错位条纹
        const stripeCount = Math.floor(
            2 + progress * 14
        );

        ctx.globalAlpha = 0.5;

        for (let i = 0; i < stripeCount; i++) {
            const y = Math.random() * height;
            const stripeHeight = 1 + Math.random() * 5;

            ctx.fillStyle = Math.random() > 0.5
                ? "#00e5ff"
                : "#ff1744";

            ctx.fillRect(
                Math.random() * width * 0.2,
                y,
                width * (0.2 + Math.random() * 0.8),
                stripeHeight
            );
        }

        ctx.globalAlpha = 1;
    }

    // 减少动态效果偏好下，显示静态故障画面
    if (reducedMotion) {
        drawGlitch();
        return;
    }

    // 约每 70ms 重绘一次，产生明显的电视雪花闪动
    drawGlitch();
    glitchTimer = setInterval(drawGlitch, 70);
}

/* ===== 停止所有故障效果 ===== */

function stopBugChaos() {
    // 停止继续生成报错窗口
    if (bugTimer !== null) {
        clearInterval(bugTimer);
        bugTimer = null;
    }

    // 停止雪花屏重绘
    if (glitchTimer !== null) {
        clearInterval(glitchTimer);
        glitchTimer = null;
    }

    // 移除窗口尺寸变化监听器
    if (glitchResizeHandler !== null) {
        window.removeEventListener(
            "resize",
            glitchResizeHandler
        );
        glitchResizeHandler = null;
    }

    // 隐藏故障场景
    const bugChaos = document.getElementById("bug-chaos");
    const container = document.getElementById("bug-window-container");
    const recovery = document.getElementById("bug-recovery");

    bugChaos.hidden = true;
    recovery.hidden = true;

    // 清空旧窗口
    container.replaceChildren();

    // 清空画布
    const canvas = document.getElementById("bug-static-canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/* ===== 恢复按钮事件 ===== */

const recoveryButton = document.getElementById("bug-recovery-button");

recoveryButton.addEventListener("click", function () {
    stopBugChaos();

    // 关闭最初的剧情弹窗
    loveDialog.hidden = true;

    // 恢复初始标题和文字
    loveTitle.textContent = "检测到一个情感错误";
    loveMessage.textContent = "你觉得这个主页怎么样？";
    loveFeedback.textContent = "";

    // 恢复三个选项
    loveOptions.forEach(function (item) {
        item.hidden = false;
    });

});


// 这一段遍历我们最开始获取的所有项目卡片。
// 每遍历到一张卡片告诉观察器：“请开始观察这个元素。”
//作用应在回调函数之前


//id：通常用来唯一定位一个元素。
//class：通常用来标记一组具有相同特征的元素。

/*
git add：选择哪些文件进入下一次提交。
git commit：将暂存区中的内容正式保存到本地版本历史。
git status：查看当前文件和暂存区的状态。
git init → git add . → git commit
内容	含义
origin	远程仓库的名称，相当于一个昵称
仓库 URL	GitHub 上的仓库地址
(fetch)	从远程仓库获取信息或代码时使用的地址
(push)	向远程仓库上传提交时使用的地址

每次更新网站需要：
git add .
git commit -m "Update homepage"  -m后面跟着的是说明文字
git push

-v 是 --verbose 的简写，意思是“详细显示”
-u：--set-upstream在 git push 中建立跟踪关系，告诉 Git，你本地的 main 分支默认对应 GitHub 上的 origin/main 分支

GitHub Pages 的项目网站通常遵循这个格式：
https://用户名.github.io/仓库名称/

检查 DOM 元素：通过 document.querySelector(".profile img") 确认选择器找到了头像。
检查计算后的 CSS：通过 getComputedStyle() 查看浏览器实际采用的动画参数。
检查动画实例：通过 getAnimations() 判断动画是否真正创建。
*/