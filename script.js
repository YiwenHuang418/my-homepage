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

cards.forEach(function (card){ //循环进行展开
    const detailButton = card.querySelector(".detail-toggle");
    const projectDetails = card.querySelector(".project-details");

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

//async表示这是一个异步函数，让函数内部可以使用await等待异步操作，调用 async 函数会返回一个 Promise。
copyButton.addEventListener("click", async function () {//async 和 await 是 JavaScript 处理异步操作的常用方式
    try{//await等待异步操作(请求浏览器写入剪贴板）的完成，再继续执行后面的代码
            //await：在这个函数中等待某个 Promise 的结果。
            //等待原因：浏览器需要完成一次剪贴板写入，才能确定是否成功。我们不能假设每次调用都会立即成功，所以使用 try/catch 来处理可能发生的错误。
        await navigator.clipboard.writeText(emailText.textContent); //访问浏览器的剪贴板接口，将文字写入剪贴板（获取邮箱元素中的文字）
        copyMessage.textContent = "邮箱已复制";//在修改页面上的提示文字，而不是弹出一个新窗口。
        
        setTimeout(function(){
            copyMessage.textContent = "";
        }, 2000);

    } catch(error){
        copyMessage.textContent = "复制失败，请手动选择并复制邮箱地址";
        console.error("复制失败：", error);

        setTimeout(function(){
            copyMessage.textContent = "";
        }, 2000);
    } 
});

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