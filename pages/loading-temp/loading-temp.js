var interval;
var varName;
var ctx = wx.createCanvasContext('canvasLoading');

export const loading = () => {
  var cxt_arc = wx.createCanvasContext('canvasLoading');//创建并返回绘图上下文context对象。
  cxt_arc.setLineWidth(8);
  cxt_arc.setStrokeStyle('#eaeaea');
  cxt_arc.setLineCap('round');
  cxt_arc.beginPath();//开始一个新的路径 
  cxt_arc.arc(60, 60, 50, 0, 2 * Math.PI, false);//设置一个原点(60,60)，半径为50的圆的路径到当前路径 
  cxt_arc.stroke();//对当前路径进行描边 
  cxt_arc.draw();
};

export const drawCircle = () => {
  clearInterval(varName);
  function drawArc(s, e) {
    ctx.setFillStyle('white');
    ctx.clearRect(0, 0, 200, 200);
    ctx.draw();
    var x = 60, y = 60, radius = 50;
    ctx.setLineWidth(8);
    ctx.setStrokeStyle('#FEE700');
    ctx.setLineCap('round');
    ctx.beginPath();
    ctx.arc(x, y, radius, s, e, false);
    ctx.stroke();
    ctx.draw();
  }
  var step = 0, startAngle = 1.5 * Math.PI, endAngle = 0;
  var animation_interval = 100, n = 60;
  var animation = function () {
    if (step <= n) {
      step++;
      endAngle = step * 2 * Math.PI / n + 1.5 * Math.PI;
      drawArc(startAngle, endAngle);
    } else {
      clearInterval(varName);
    }
  };
  varName = setInterval(animation, animation_interval);
};