addinit(function () {
    var enterfun = function () {
        //这是初始页面消失进入主页的函数
        eles.domcontainer.appendChild(eles.mainmb);
        //去掉底下的遮挡页面
        eles.headpage.style.opacity = '0'; //初始页面消失
        //删除遮挡
        setTimeout(function () {
            eles.domcontainer.appendChild(eles.headpage);
        }, 1000);
    }
    var headfun = function () {
        //刚开始进入时的函数
        eles.headpage.style.opacity = '1';
        setTimeout(enterfun, 2000); //2s后进入主页
    }
    headfun();
});