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
    } catch(error){
        copyMessage.textContent = "复制失败，请手动选择并复制邮箱地址";
        console.error("复制失败：", error);
    } 
});

//id：通常用来唯一定位一个元素。
//class：通常用来标记一组具有相同特征的元素。

