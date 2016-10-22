addinit(function () {
    //    var enterfun = function () {
    //        //这是初始页面消失进入主页的函数
    //        
    //        //去掉底下的遮挡页面
    //        eles.headpage.style.opacity = '0'; //初始页面消失
    //        //删除遮挡
    //        setTimeout(function () {
    //            
    //        }, 2000);
    //    }
    //    var headfun = function () {
    //        //刚开始进入时的函数
    //        eles.headpage.style.opacity = '1';
    //        setTimeout(enterfun, 3000); //2s后进入主页
    //    }
    //    headfun();
    //head部分
    var head = function () {
        eles.headpage.addClass('ani-head');
        setTimeout(function () {
            eles.domcontainer.appendChild(eles.mainmb);
        }, 1500 + 100); //1500正好在静置时间中 避免临界导致的问题 100为延迟
        setTimeout(function () {
            eles.domcontainer.appendChild(eles.headpage);
        }, 4600); //本来应该是4100但是因为4100会导致提前结束 所以只能改成4600
    }
    var loadpages = function () {
        var table = document.getElementsByClassName('page');
        for (var i = 0; i < table.length; i++) {
            var id = table[i].id;
            //            eval("load.loadToNode(document.getElementById('{0}'),'pages/{1}.html');".format(name, name)); //运行指令
            loader.loadToNode(table[i], "./pages/{0}.html".format(id));
        }
    }
    head();
    loadpages();
});