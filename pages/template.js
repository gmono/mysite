//模板引擎
/*
模板引擎介绍
模板引擎对象接受一个模板域id 模板域必须是个garea标签 并且其中的一级子标签必须都是gtemplate
模板的名字右gname属性定义
 */
var GTemplate = {};
GTemplate.Enginer = function (areaname) {
    //engine对象
    if (areaname == undefined || areaname == null || areaname == "") throw "错误，模板域名称不能为空";
    var areanode = document.getElementById(areaname);
    if (areanode == null || areanode == undefined || areanode.tagName != 'GAREA') throw "错误，模板域信息错误";
    var tnodes = areanode.childNodes;
    var gnodes = []; //这是template的列表
    for (var t = 0; t < tnodes.length; ++t) switch (tnodes[t].nodeName) {
        case '#text':
            continue;
        case 'GAREA':
            gnodes.push(tnodes[t]);
            break;
        default:
            throw "错误，不能存在其他标签";
        }
        //把模板加入模板列表
    this.TemplateList = {};
    this.Parse = function (tempnode) {
        //解析模板 返回{tempnode:tempnode,textnode:[],htmlnode:[]}
        //value都有一个节点和一个名字
        var ret = {};
        ret.tempnode = tempnode;
        ret.textnode = {};
        ret.htmlnode = {};
        var istext = function (str) {}; //都返回一个pnodename 如果不是就返回null
        var ishtml = function (str) {};
        var allnodes = GetAllChildren(tempnode);
        for (var t = 0; t < allnodes.length; ++t) {
            var pnodename = "";
            var pnode = allnodes[t];
            switch (pnode.nodeName) {
            case '#text':
                if ((pnodename = istext(pnode.nodeValue)) != null && !(pnodename in ret.textnode || pnodename in ret.htmlnode)) ret.textnode[pnodename] = pnode;
                else if ((pnodename = ishtml(pnode.nodeValue)) != null && !(pnodename in ret.textnode || pnodename in ret.htmlnode)) ret.htmlnode[pnodename] = pnode;
                break;
            case 'GVALUE':
                //未完待续…………………………………………………………………………
            }
        }
    }
    for (var t = 0; t < gnodes.length; ++t) {
        var gn = gnodes[t];
        var name = gn.getAttribute('gname');
        if (name in this.TemplateList) throw "错误，模板名称重复";
        //加入
        this.TemplateList[name] = gn;
    }
    //初始化所有模板
}