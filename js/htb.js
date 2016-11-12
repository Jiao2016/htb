/**
 * Created by 嬌嬌 on 2016/11/8.
 */
window.onload=function () {
    var canvas=document.querySelector("canvas");
    var color=document.querySelector("#color");
    var width=document.querySelector("#number");
    var cobj=canvas.getContext("2d");
    var typechoose=document.querySelector("#typechoose");
    var choose2=document.querySelector("#choose2");
    var poly=document.querySelector("#poly");
    var linenum=document.querySelector("#linenum");
    var checkboxs=document.querySelectorAll("[type='checkbox']");
    var chooseboxLeft=document.querySelector(".choosebox-left");
    var type="rect";
    var newwidth="800";
    var newheight="500";
    typechoose.onblur=function () {
        type=this.value;
    };
    //背景色
    var bgcolor=document.querySelector("#bgcolor");
    bgcolor.onchange=function () {
        canvas.style.background=this.value;
    };
    //多边形
    poly.onchange=function () {
        if(poly.checked){
            cancelChecked();
            this.checked=true;
            type="poly";
        }else{
            type=typechoose.value;
        }
    };
    //多边形边数
    var lnum=3;
    linenum.onchange=function () {
        lnum=this.value;
    };
    //铅笔
    var pencil=document.querySelector("#pencil");
    pencil.onchange=function () {
        if(pencil.checked){
            cancelChecked();
            this.checked=true;
            type="pencil";
            canvas.style.cursor="url(./images/铅笔.png),default";
        }else{
            type=typechoose.value;
            canvas.style.cursor="crosshair";
        }
    };
    //橡皮
    var eraser=document.querySelector("#eraser");
    eraser.onchange=function () {
        if(eraser.checked){
            cancelChecked();
            this.checked=true;
            canvas.style.cursor="url(./images/橡皮擦.png),default";
            type="eraser";
        }else{
            type=typechoose.value;
            canvas.style.cursor="crosshair";
        }
    };
    //剪切
    var cut=document.querySelector("#cut");
    cut.onchange=function () {
        if(cut.checked){
            cancelChecked();
            this.checked=true;
            type="cut";
        }else{
            type=typechoose.value;
            canvas.style.cursor="crosshair";
        }
    };
    //复制
    var copy=document.querySelector("#copy");
    var iscopy=false;
    copy.onchange=function () {
        if(copy.checked){
            cancelChecked();
            this.checked=true;
            type="cut";
            iscopy=true;
        }else{
            type=typechoose.value;
            iscopy=false;
            canvas.style.cursor="crosshair";
        }
    };
    //鼠标事件
    var ox,oy,ow,oh;
    var arr=[];
    var cutflag=false;//控制和判断当前进行到第几部
    var cutdata;//被剪切或复制的数据
    var lox,loy,low,loh;//保存剪切区域位置和大小
    canvas.onmousedown=function (e) {
        ox=e.offsetX;
        oy=e.offsetY;
        if(type=="pencil"){
            cobj.beginPath();
            cobj.moveTo(ox,oy);
        }
        var draw=new Draw(cobj,{color:color.value,width:width.value,type:choose2.value});
        canvas.onmousemove=function (e) {
            ow=e.offsetX;
            oh=e.offsetY;
            if(type!="eraser"){
                cobj.clearRect(0,0,newwidth,newheight);
                if(arr.length!=0){
                    cobj.putImageData(arr[arr.length-1],0,0,0,0,newwidth,newheight)
                }
            }
            if(cutflag&&type=="cut"){
                cobj.clearRect(lox-1,loy-1,low-lox+2,loh-loy+2);
                if(iscopy){
                    cobj.putImageData(arr[arr.length-2],0,0,0,0,newwidth,newheight)
                }
                var nx=lox+ow-ox;//上一次的位置，加上鼠标移动的距离，移动到的位置
                var ny=loy+oh-oy;
                cobj.putImageData(cutdata,nx,ny);//放置的数据
                // cobj.putImageData(cutdata,ow,oh);//
            }else if(type=="poly"){
                draw[type](ox,oy,ow,oh,lnum)
            }else{
                draw[type](ox,oy,ow,oh);
            }
        };
        canvas.onmouseup=function () {
            canvas.onmousemove=null;
            canvas.onmouseup=null;
            if(type=="cut"){
                if(cutflag==false){
                    cutflag=true;
                    cutdata=cobj.getImageData(ox+1,oy+1,ow-ox-2,oh-oy-2);
                    lox=ox;//上一次的数据
                    loy=oy;
                    low=ow;
                    loh=oh;
                    chooseboxLeft.style.display="none";
                    cobj.clearRect(ox+1,oy+1,ow-ox-2,oh-oy-2);
                    cobj.putImageData(cutdata,ox+1,oy+1);
                }else{
                    cutflag=false;
                    chooseboxLeft.style.display="block";
                }
            }
            arr.push(cobj.getImageData(0,0,newwidth,newheight));
        }
    };
    //多选判断函数
    function cancelChecked() {
        for (var i=0;i<checkboxs.length;i++){
            checkboxs[i].checked=false;
            iscopy=false;
        }
    }
    //撤销
    var back=document.querySelector(".back");
    back.onclick=function () {
        arr.pop();
        cobj.clearRect(0,0,800,500);
        cobj.putImageData(arr[arr.length-1],0,0,0,0,newwidth,newheight)
    };
//    保存
    var save=document.querySelector(".save");
    save.onclick=function () {
        var res=canvas.toDataURL("image/png");
        // var res=canvas.toDataURL("image/png").replace("image/png","image/octet-stream");
        location.href=res;
    };
//    清空
    var clear=document.querySelector(".clear");
    clear.onclick=function () {
        arr=[];
        cobj.clearRect(0,0,newwidth,newheight)
    };
//    创建
    var creat=document.querySelector(".creat");
    var body=document.querySelector("body");
    var flagc=true;
    creat.onclick=function () {
        if(flagc){
            flagc=false;
            cobj.clearRect(0,0,newwidth,newheight);
        }else{
            cobj.clearRect(0,0,newwidth,newheight);
        }
        arr=[];
        newwidth=prompt("请输入需要的宽度：","")||"800";
        newheight=prompt("请输入需要的高度：","")||"500";
        // lnewwidth=newwidth;
        // lnewheight=newheight;
        console.log(newwidth);
        canvas.width=newwidth;
        canvas.height=newheight;
    }
};
    
    
    
    
