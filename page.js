//以下为切换函数相关
//注意 page都是绝对布局
//page动画时间为450ms
var transfuns = {};
//transfuns.缩放左平移 = function (outnode, innode) {
//    //线性上下平移切换函数
//    //预置变量
//    var scaltext = "scaleX(0.95) scaleY(0.95)";
//    //初始化
//    //    var inset = new StyleSet(innode);
//    //    inset.pusharray(['top', 'transform', 'left']);
//    //    var outset = new StyleSet(outnode);
//    //    outset.pusharray(['transform']);
//    //设置初始状态
//    innode.style.top = "0";
//    innode.style.transform = "translateX(130%)";
//    innode.style.left = "0";
//    //装入innode
//    eles.main_viewport.appendChild(innode);
//    //eles.main_viewport.insertBefore(innode, outnode);
//    //缩放
//    outnode.style.transform = scaltext;
//    innode.style.transform += scaltext;
//    //缩小
//    setTimeout(function () {
//        //延时平移
//        outnode.style.transform += " translateX(-130%)";
//        innode.style.transform = scaltext; //去掉向上平移，以去除隐藏
//        //开始动画
//        setTimeout(function () {
//            //动画完成
//            //去除outnode
//            eles.domcontainer.appendChild(outnode);
//            //复位
//            //inset.close();
//            //outset.close();
//            innode.style.transform = outnode.style.transform = "";
//        }, 500);
//    }, 500);
//};
//transfuns.渐进隐现 = function (outnode, innode) {
//    //淡入淡出带点向上平移
//    //初始化
//    //    var inset = new StyleSet(innode);
//    //    var outset = new StyleSet(outnode);
//    //    inset.pusharray(['opacity', 'left', 'top']);
//    //设置初始状态
//    //    innode.style.opacity = '0';
//    //    innode.style.left = '0';
//    //    innode.style.top = "-25%";
//    //    eles.main_viewport.appendChild(innode); //把innode放在outnode的上面
//    //    //进入第一次状态调整
//    //    innode.style.top = "0";
//    //    innode.style.opacity = "1";
//    //    setTimeout(function () {
//    //        //动画完成后进入第二次状态调整
//    //        //去除outnode
//    //        eles.domcontainer.appendChild(outnode);
//    //    }, 450);
//    //由于莫名地bug导致此动画不能使用 所以改用animal
//};
/////////////////////
//由于animal太好用所有不使用手动动画了
//////////////////
//动画相关
//向左平移
transfuns.缩放左平移 = function (outnode, innode) {
    eles.main_viewport.insertBefore(innode, outnode);
    outnode.addClass('ani-page-left-out');
    innode.addClass('ani-page-left-in'); //执行动画
    setTimeout(function () {
        eles.domcontainer.appendChild(outnode);
        outnode.removeClass('ani-page-left-out');
        innode.removeClass('ani-page-left-in'); //执行动画
    }, 1600);
};
transfuns.渐进隐现 = function (outnode, innode) {
    eles.main_viewport.insertBefore(innode, outnode);
    outnode.addClass('ani-page-yin');
    innode.addClass('ani-page-xian');
    setTimeout(function () {
        eles.domcontainer.appendChild(outnode);
        outnode.removeClass('ani-page-yin');
        innode.removeClass('ani-page-xian');
    }, 1600);
};
transfuns.直接左平移 = function (outnode, innode) {
    eles.main_viewport.insertBefore(innode, outnode);
    outnode.addClass('ani-page-left-x-out');
    innode.addClass('ani-page-left-x-in'); //执行动画
    setTimeout(function () {
        eles.domcontainer.appendChild(outnode);
        outnode.removeClass('ani-page-left-x-out');
        innode.removeClass('ani-page-left-x-in'); //执行动画
    }, 1100);
};
transfuns.直接上平移 = function (outnode, innode) {
    eles.main_viewport.insertBefore(innode, outnode);
    outnode.addClass('ani-page-up-out');
    innode.addClass('ani-page-up-in'); //执行动画
    setTimeout(function () {
        eles.domcontainer.appendChild(outnode);
        outnode.removeClass('ani-page-up-out');
        innode.removeClass('ani-page-up-in'); //执行动画
    }, 1100);
};
transfuns.随机 = function (outnode, innode) {
    //以下缩放左平移感觉不好看就展示屏蔽了
    var table = [transfuns.渐进隐现, /*transfuns.缩放左平移,*/ transfuns.直接左平移, transfuns.直接上平移];
    var index = parseInt(Math.random() * 10) % table.length;
    var fun = table[index];
    fun(outnode, innode);
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
};
//预定义页面切换函数
var about_fun = function () {}; //剩下的没有加
function pagetrans(btn) {
    //页面切换函数
    var id = btn.id;
    var pid = map[id];
    if (pid == nowpageid) return;
    var inele = document.getElementById(pid);
    var outele = document.getElementById(nowpageid);
    //transfuns.缩放左平移(outele, inele);
    //transfuns.渐进隐现(outele, inele);
    transfuns.随机(outele, inele);
    //设置激活的按钮
    document.getElementById(nowbtnid).removeClass('navactive');
    document.getElementById(id).addClass('navactive');
    //更新目前的页面和按钮的记录
    nowbtnid = id;
    nowpageid = pid;
    //调用页面的enter函数（页面名_fun）
    eval("{0}_fun();".format(pid));
}