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
//以下为切换函数相关
var transfuns = {};
transfuns.udtrans = function (outnode, innode) {
    //线性上下平移切换函数
    //预置变量
    var scaltext = "scaleX(0.9) scaleY(0.9)";
    //设置初始状态
    innode.style.top = "0";
    innode.style.transform = "translateX(130%)";
    innode.style.left = "0";
    //装入innode
    eles.main_viewport.appendChild(innode);
    //eles.main_viewport.insertBefore(innode, outnode);
    //缩放
    outnode.style.transform = scaltext;
    innode.style.transform += scaltext;
    //缩小
    setTimeout(function () {
        //延时平移
        outnode.style.transform += " translateX(-130%)";
        innode.style.transform = scaltext; //去掉向上平移，以去除隐藏
        //开始动画
        setTimeout(function () {
            //动画完成
            //去除outnode
            eles.domcontainer.appendChild(outnode);
            //复位
            outnode.style.transform = innode.style.transform = "";
        }, 450);
    }, 450);
};
//以下为页面相关
var nowpageid = 'main'; //当前页面id默认为主页
var nowbtnid = "btn1"; //当前激活的按钮
//页面节点与按钮的映射表
var map = {
    btn1: 'main'
    , btn2: 'blog'
    , btn3: 'album'
    , btn4: 'info'
    , btn5: 'about'
}

function pagetrans(btn) {
    //页面切换函数
    var id = btn.id;
    var pid = map[id];
    if (pid == nowpageid) return;
    var inele = document.getElementById(pid);
    var outele = document.getElementById(nowpageid);
    transfuns.udtrans(outele, inele);
    //设置激活的按钮
    document.getElementById(nowbtnid).className = "navbutton";
    document.getElementById(id).className = "navbutton navactive";
    //更新目前的页面和按钮的记录
    nowbtnid = id;
    nowpageid = pid;
}