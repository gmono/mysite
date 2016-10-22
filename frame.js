String.prototype.format  =   function (args)  {    
    var  result  =  this;    
    if  (arguments.length  >  0)  {            
        if  (arguments.length  ==  1  &&  typeof  (args)  ==  "object")  {            
            for  (var  key  in  args)  {                
                if (args[key] != undefined) {                    
                    var  reg  =  new  RegExp("({"  +  key  +  "})",  "g");                    
                    result  =  result.replace(reg,  args[key]);                
                }            
            }        
        }        
        else  {            
            for  (var  i  =  0;  i  <  arguments.length;  i++)  {                
                if  (arguments[i]  !=  undefined)  {           //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
                    　　　　　　　　　　　　
                    var reg = new RegExp("({)" + i + "(})", "g");                    
                    result  =  result.replace(reg,  arguments[i]);                
                }            
            }        
        }    
    }    
    return  result;
}
Array.prototype.contains  =   function (item) {  
    return  RegExp("\\b" + item + "\\b").test(this);
};
//基础库函数区域
var initlist = [];

function addinit(fun) {
    if (!(fun in initlist)) {
        initlist.push(fun);
    }
}
window.onload = function () {
        for (var i = 0; i < initlist.length; i++) {
            var fun = initlist[i];
            fun();
        }
    }
    //以上为启动框架
    //以下为基础环境设置
    //基础环境构造目的在于让所有有id的标签都可以被直接访问
    //
    //扫描dom的函数 把所有有id节点都加入container中
function scandom(ele, container) {
    var clist = ele.childNodes;
    for (var i = 0; i < clist.length; ++i) {
        var cele = clist[i];
        if (cele.nodeName.toLowerCase() == '#text') continue; //如果是文本就跳过，此为递归收敛条件
        if (cele.id != '') {
            //加入eles
            eval("eles.{0}=document.getElementById('{1}');".format(cele.id, cele.id));
            //以上添加对应对象进去
        }
        if (cele.hasChildNodes()) {
            //递归调用
            scandom(cele); //递归处理当前dom节点
        }
    }
}
var eles = {};
addinit(function () {
    //这里扫面body内所有节点 并保存有id的部分
    var body = document.body;
    scandom(body, eles); //扫面整个文档
});
//以下为工具函数
function StyleSet(node) {
    //状态集类
    this.node = node;
    this.set = {}; //状态集合
    this.push = function (stylename) {
        //这是改变node的style的函数
        if (this.set[stylename] == undefined) {
            //如果没有保存了初始状态
            this.set[stylename] = this.node.style[stylename]; //保存初始状态
        }
    };
    this.pusharray = function (snames) {
        for (var i = 0; i < snames.length; i++) this.push(snames[i]);
    }
    this.close = function () {
        for (var t in this.set) {
            this.node.style[t] = this.set[t]; //
        }
    }
}

function GetStringFormArray(arr, schar) {
    var ret = "";
    for (var i = 0; i < arr.length; i++) {
        ret += arr[i];
        ret += schar;
    }
    return ret;
}
//类操作函数
Element.prototype.GetClasses = function () {
        return this.className.split(' ');
    }
    //添加类
Element.prototype.addClass = function (classname) {
        var classes = this.GetClasses();
        classes.push(classname);
        this.className = GetStringFormArray(classes, ' ');
    }
    //删除类
Element.prototype.removeClass = function (classname) {
        var classes = this.GetClasses();
        if (classes.contains(classname)) {
            classes.splice(classes.indexOf(classname));
            this.className = GetStringFormArray(classes, ' ');
        }
    }
    //此函数设计错误，js单线程 异步是用任务队列实现的 无法实现此功能
    //function sleep(ms) {
    //    var isend = false;
    //    setTimeout(function () {
    //        isend = true;
    //    }, ms);
    //    while (!isend);
    //}
var loader = {};
loader.loadfile = function (url, fun) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var text = xhr.responseText;
            fun(text);
        }
    }
    xhr.send();
}
loader.loadToNode = function (node, url) {
    loader.loadfile(url, function (text) {
        node.innerHTML = text;
    });
}