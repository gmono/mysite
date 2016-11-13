//模板引擎 依赖frame.js
///以上是旧的模板引擎设计
//以及定义
//插件格式主对象定义：主对象存储在GTlate.Plugins中，每个对象有一个专用的识别名
//主对象格式： Parse函数：function(tlnode,contobj);tlnode为模板节点 contobj为单一viewer中的此插件专用的容器对象；
//Render函数：function(tlnode,contobj,userdata);此函数接受一个模板节点的副本和一个viewer中存储此对象信息的容器，并根据用户数据(userdata)对模板节点副本中内容进行修改
//注意Render函数的掉用顺序和插件的声明顺序相同  请注意相互作用
//注意 理想情况下假设不同插件互不影响
//预定义变量 Name:唯一插件名 UNameSpace:用户数据命名空间


//归纳：garea 可选属性 id
//gtemplate 可选属性 otype 展开属性 tlname 模板名
GTlate = {}; //模板引擎容器对象
GTlate.GenTools = {}; //工具函数集合 其中有例如从文本到dom节点的转换之类的工具函数
GTlate.Plugins = {}; //插件全局相关对象
GTlate.Plugins.List = {}; //插件列表 保存由pname->PluginContentObject的映射
//注意此处有两种对象 一种为插件主对象 一种为插件信息对象PluginContentObject 
//插件信息对象结构{mainobj,name,usname};mainobj为主对象 name为插件名 usname为用户数据命名空间名
GTlate.Plugins.Load = function (text) {}; //从文本加载插件 注意重名插件则不加载或者覆盖
GTlate.Plugins.LoadFile = function (path) {}; //从文件加载插件
GTlate.Plugins.CoverLoad = false; //策略 指定是否覆盖加载 若为false则重名插件不加载 此标记在load函数中被使用
GTlate.Areas = {};
GTlate.Areas.Area = function (anode) {};
GTlate.Areas.LoadFromText = function (text) {};
GTlate.Areas.LoadFromFile = function (path) {}; //从指定文件加载一个area对象列表 顺序为文件中的顺序
GTlate.Areas.LoadFromId = function (id) {}; //从指定id的Area节点加载一个 Area对象
GTlate.View = {}; //视图相关容器
GTlate.View.Viewer = function (tlnode, pnlist) {}; //视图对象 一般由Area对象创建
GTlate.View.LoadFromId = function (nid, pnlist) {}; //从指定id的Gtemplate节点加载一个Viewer
GTlate.View.RenderObj = function (viewobj, userdata) {}; //用户数据绑定对象 用于重复渲染
//二级定义
GTlate.Plugins.Load = function (text) {
    //从文本中加载一个插件
    //text为符合主对象格式的js文本
    var Name = null;
    var UNameSpace = null;
    //以上为预定义变量
    //下面构造主对象函数
    var mainfun=null;
    eval("mainfun=function(){{0}};".format(text));
    var mainobj = new mainfun(); //调用构造函数得到主对象和预定义变量值
    if (Name == null || UNameSpace == null) return; //插件加载失败
    if (!GTlate.Plugins.CoverLoad) {
        //重名检测
        if (Name in GTlate.Plugins.List) return;
    }
    //开始加载插件流程
    //检测是否有指定函数
    if (mainobj.Parse == undefined || mainobj.Parse == null || mainobj.Render == undefined || mainobj.Render == null) return; //加载失败
    //构造插件信息对象
    var infoobj = {
        mainobj: mainobj
        , name: Name
        , usname:UNameSpace
    };
    //插入信息对象表
    GTlate.Plugins.List[Name] = infoobj; //加载完成
    //返回信息对象
    return infoobj;
};
GTlate.Plugins.LoadFile = function (path) {
    //从文件中加载插件
    var text = null;
    loader.loadfile(path, function (str) {
        text = str;
    }, false);
    GTlate.Plugins.Load(text);
};
GTlate.Areas.Area = function (anode) {
    //节点tagname为garea
    //这里定义Area对象
    //Area对象对应一个Area节点 
    //Area节点内部有两种子元素 一种是PluginDef标签 属性src对应插件js文件链接 如果没有src属性或者src为空 则自动以其内部的文本作为插件js文本
    //第二种为GTemplate元素  此元素对应一个模板 其属性为
    //1：展开模式 otype 属性值有inner contain normal三种 具体在说明文件中
    //2：模板名(在此模板域中不可重复) tlname
    //以下为二级定义
    //校验部分
    if (anode == null || anode == undefined || anode.nodeName != 'GAREA') return;
    //以上限定area标签名
    this.GetListAsObj = function () {
        //此函数为将模板字典变成一个对象
        //对象的属性值与字典的键值对一一对应
        var ret = {};
        //构造对象
        for (var t in this.ViewerSet) {
            eval("ret.{0}={1};".format(t, this.ViewerSet[t]));
        }
        return ret;
    };
    this.Of = function (name) {
        //此函数为从模板名字获取viewer对象的函数
        return this.ViewerSet[name];
    };
    //以下为初始化代码 作用为解析area标签 得到插件列表和模板列表(对应的一个viewer表)
    //处理插件定义的部分
    this.PluginList = [];//插件列表 string[] 存储插件名字（不存储插件对象）
    var plugnodes = GTlate.GenTools.GetNodes(anode, "GPLUGIN", false);
    for (var t = 0; t < plugnodes.length; t++) {
        var text=GTlate.GenTools.GetNodeContent(plugnodes[t]);
        var obj=GTlate.Plugins.Load(text); //加载每个插件
        this.PluginList.push(obj.name); //记录此area的插件表
        //注意此处存在一个细节 即插件定义在前面的优先记录 也就是说Render时的插件渲染函数执行顺序是按照定义顺序来的
        //此处假设不同插件互不影响 但是由于某些原因 有时确实存在影响因此 需要注意此顺序问题
    }
    //处理模板列表部分
    this.ViewerSet = {};//存储viewer列表
    var tempnodes = GTlate.GenTools.GetNodes(anode, "GTEMPLATE", false);
    for (var t = 0; t < tempnodes.length; ++t) {
        var name = tempnodes[t].getAttribute('tlname'); //模板名字
        this.ViewerSet[name] = new GTlate.View.Viewer(tempnodes[t], this.PluginList); //用指定的模板节点和固定的插件列表创建一个viewer并加入set
    }
    //that's all
};
GTlate.Areas.LoadFromId=function (id) {
    var node=document.getElementById(id);
    var ret=new GTlate.Areas.Area(node);
    return ret;
};
GTlate.View.Viewer = function (tlnode, pnlist) {
    //此为视图器对象
    //校验阶段
    //所有处理具体模板节点的代码都在此对象中
    if (tlnode.nodeName != 'GTEMPLATE') return; //不允许非GTemplate标签
    //声明阶段
    this.infolist = {};
    this.infolist.tlnode = tlnode; //保存模板节点
    this.infolist.infos = {}; //保存插件信息 每个插件对应一个同名的对象容器
    this.infolist.upmap = {}; //保存插件名到用户数据命名空间名的映射 以便使用数据命名空间名在userdata中得到用户数据容器
    this.Render = function (userdata) {}; //渲染函数 从用户数据得到
    this.GetRenderObj = function (userdata) {}; //渲染到对象的函数 返回一个RenderObj类型对象 此对象有一个Render函数 原型与此类的Render相同
    //处理插件列表
    for (var t = 0; t < pnlist.length; t++) {
        var pname = pnlist[t];
        var infoobj = GTlate.Plugins.List[pname];
        //处理infos
        this.infolist.infos[pname] = {}; //创建一个针对此插件的预定义数据容器
        //处理upmap
        this.infolist.upmap[pname] = infoobj['usname']; //做出name到usname的映射
        //以上为保存模板的信息
        //以下为调用插件预处理模板得到预定义数据
        var mainobj = infoobj['mainobj']; //得到主对象
        mainobj.Parse(tlnode, this.infolist.infos[pname]); //预处理模板
    };
    //以上预处理过程结束
    //具体定义Render和Render到obj
    var tempthis = this;
    this.GetRenderObj = function (userdata) {
        //渲染到对象
        var ret = new GTlate.View.RenderObj(tempthis, userdata); //创建一个RenderObj对象返回
        return ret;
    };
    var tempinfos = this.infolist.infos;
    var tempupmap = this.infolist.upmap; //构建临时变量
    //以下为重点：模板渲染函数
    this.Render = function (userdata) {
        //渲染 返回node对象
        //注意此函数可能返回dom节点也可能返回dom节点列表
        //具体工作为按顺序掉用插件的Render函数处理模板副本 最后“展开”后返回此副本
        var SFun = function (ctlnode) {
            //展开函数用于在处理完模板节点后将其变成可以插入html文档中的dom节点或dom节点列表
            var type = ctlnode.getAttribute('otype'); //获取模板节点的otype属性 如果没有默认normal
            switch (type) {
            case "inner":
                //此选项为将其内部内容作为一个dom节点列表返回
                return ctlnode.childNodes;
                break;
            case "contain":
                //此选项将模板节点转变为一个“独立定位块”也就是外一层普通div加内一层相对布局的div
                return GTlate.GenTools.GetNodeFromText("<div>{0}</div>".format(ctlnode.innerHTML));
                break;
            default:
                //此为默认选项就即normal 当没有指定otype时默认为此选项
                //此选项将gtemplate节点的tagname变成div后返回
                return GTlate.GenTools.GetNodeFromText("<div><div class={0}>{1}</div></div>".format("\"template_innercontainer\"", ctlnode.innerHTML));
                break;
            }
        };
        //得到模板节点的副本
        var copytl = GTlate.GenTools.GetNodeFromText(tlnode.outerHTML);
        //以下开始处理模板节点的副本
        for (var t = 0; t < pnlist.length; t++) {
            //这里遍历插件名称列表 使用插件的Render函数处理模板节点副本
            var infoobj = GTlate.Plugins.List[pnlist[t]]; //得到信息对象
            var mainobj = infoobj.mainobj; //得到插件主对象
            var pname = pnlist[t]; //此为插件名
            var cont = tempinfos[pname]; //得到其预定义数据容器
            var udata = userdata[tempupmap[pname]]; //得到用户数据容器
            mainobj.Render(copytl, cont, udata); //调用render函数处理模板节点副本
        }
        var ret = SFun(copytl); //展开副本
        return ret; //返回副本
        ////一次中断标记
    };
    this.GetRenderObj=function(userdata){
        //用确定的userdata获取一个渲染目标对象
        return new GTlate.View.RenderObj(this,userdata);
    }
};
GTlate.View.RenderObj = function (viewobj, userdata) {
    this.Render = function (extrdata) {
        var copyud=JSON.parse(JSON.stringify(userdata));
        if(extrdata==undefined)
            return viewobj.Render(copyud);
        //处理extrdata附加数据
        Marge(copyud,extrdata);
        //合并完成 渲染
        return viewobj.Render(copyud);//渲染
    };
};
GTlate.GenTools.GetElementOfIndex = function (index, list) {
    //此函数用于获取指定列表中的某一个节点（非文本节点）
    var sum = 0;
    for (var t = 0; t < list.length; ++t) {
        if (list[t].tagName != undefined)
            if (index == sum) return list[t];
            else sum++;
    }
    return null;
};
GTlate.GenTools.GetElementOfIndexAsType = function (index, list, tagname) {
    //此函数用于获取指定列表中某一个指定tagname的节点
    for (var t = 0; t < list.length; ++t) {
        if (list[t].tagName == tagname)
            if (index == sum) return list[t];
            else sum++;
    }
    return null;
};
//通用函数定义位置
//文本到dom的函数 返回dom节点容器
GTlate.GenTools.TextToDom = function (text) {
    var cont = document.createElement('div');
    cont.innerHTML = text;
    return cont;
};
//从一个只包含一个html节点的文本中获得那一个节点
GTlate.GenTools.GetNodeFromText = function (text) {
    return GTlate.GenTools.GetElementOfIndex(0, GTlate.GenTools.TextToDom(text).childNodes);
    //返回第一个子元素 适用于文本中只有一个元素的情况
};
GTlate.GenTools.GetNodes = function (fnode,nodename, isover) {
    //此函数为获取指定节点中所有子元素中或者子孙元素中的指定nodename的node
    var childs = isover ? GetAllChildren(fnode) : fnode.childNodes;
    var rets = [];
    for (var i = 0; i < childs.length; ++i) {
        var n = childs[i];
        if (n.nodeName == nodename) {
            rets.push(n);
        }
    }
    return rets;
};
GTlate.GenTools.GetNodeContent = function (node) {
    //获取指定节点的“内容”
    //内容可以由src属性指定的文件的内容决定 如果src为空则取其内部的文本
    //此为“内容获取策略”函数，属策略决定函数集
    var srcstr = node.getAttribute('src');
    var ret = "";
    if (srcstr == null || srcstr == undefined || srcstr == "") ret = node.innerHTMLl;
    else {
        //进入获取文件内容的过程
        var text = null;
        loader.loadfile(srcstr, function (t) {
            text = t;
        }, false); //同步获取文件内容
        ret = text;
    }
    return ret;
}