/**
 * Created by 嬌嬌 on 2016/11/8.
 */
function Draw(cobj,seeting) {
    this.cobj=cobj;
    this.type=seeting.type||"stroke";
    this.color=seeting.color||"#000000";
    this.width=seeting.width||"1";
}
Draw.prototype={
    init:function () {
        this.cobj.strokeStyle=this.color;
        this.cobj.fillStyle=this.color;
        this.cobj.lineWidth=this.width;
    },
    rect:function (x,y,x1,y1) {
        this.init();
        this.cobj.beginPath();
        this.cobj.rect(x,y,x1-x,y1-y);
        if(this.type=="stroke"){
            this.cobj.stroke();
        }else{
            this.cobj.fill();
        }
    },
    circle:function (x,y,x1,y1) {
        this.init();
        this.cobj.beginPath();
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        this.cobj.arc(x,y,r,0,Math.PI*2);
        if(this.type=="stroke"){
            this.cobj.stroke();
        }else{
            this.cobj.fill();
        }
    },
    line:function (x,y,x1,y1) {
        this.init();
        this.cobj.beginPath();
        this.cobj.moveTo(x,y);
        this.cobj.lineTo(x1,y1);
        this.cobj.stroke();
    },
    poly:function (x,y,x1,y1,lnum) {
        this.init();
        var cobj=this.cobj;
        var r=Math.sqrt((x1-x)*(x1-x)+(y1-y)*(y1-y));
        cobj.beginPath();
        cobj.save();
        cobj.translate(x,y);
        var nx=Math.cos(Math.PI/lnum)*r;
        var ny=Math.sin(Math.PI/lnum)*r;
        cobj.beginPath();
        cobj.moveTo(nx,ny);
        for(var i=0;i<=lnum;i++){
            cobj.save();
            cobj.rotate(i * Math.PI/(lnum/2));
            cobj.lineTo(nx, -ny);
            if(this.type=="stroke"){
                cobj.stroke();
            }else{
                cobj.fill();
            }
            cobj.restore();
        }
        cobj.restore();
    },
    pencil:function (x,y,x1,y1) {
        this.init();
        var cobj=this.cobj;
        cobj.lineTo(x1,y1);
        cobj.stroke();
    },
    eraser:function (x,y,x1,y1) {
        this.init();
        var cobj=this.cobj;
        cobj.clearRect(x1,y1,10,10);
    },
    cut:function (x,y,x1,y1) {
        // this.init();
        var cobj=this.cobj;
        cobj.save();
        cobj.lineWidth=1;
        cobj.strokeStyle="#333";
        cobj.setLineDash([4,2]);
        cobj.beginPath();
        cobj.strokeRect(x,y,x1-x,y1-y);
        cobj.restore();
    }
};