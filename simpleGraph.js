/*************************************************************
 * simpleGraph.js :
 *    Simple Javascript Graph Library
 * 
 *    (c) https://github.com/truemaxdh/simpleGraph.js, 
 *        truemaxdh@gmail.com
 *************************************************************/
var tag = document.createElement("div");
tag.style = "border:1px solid black;position:absolute;" +
            "background-color:#333;color:#fff;font-weight:bold;" +
            "border-radius:5px;padding:3px;";


function emphasize(evt, obj, lbl, val) {
  obj.style.fillOpacity=1.0;
  obj.parentNode.parentNode.appendChild(tag);
  tag.style.left = evt.pageX;
  tag.style.top = evt.pageY;
  tag.innerHTML = lbl + "<br>" + val;
}

function getBack(obj) {
  obj.style.fillOpacity=0.7;
  obj.parentNode.parentNode.removeChild(tag);
}



function simpleGraph() {
	this.colors = ["#ff2200", "#22ff00", "#1111ff","#aaaa00", "#00aaaa", "#aa00aa","#ffaaaa", "#aaffaa", "#aaaaff"];
	this.setColors = function(colors) {
		this.colors = colors;
	};
	
	/******************/
	/** Line graph **/
	/******************/
	// labelFormat.
	//    w : left width,
	//    h : bottom height,
	//    rotate : bottom label's rotation(radian)
	this.drawLineGraph = function(canvasID, labelArr, valueArr, labelFormat) {
		if ((valueArr.length % labelArr.length) != 0)
			return;
		
		var lf = labelFormat ? labelFormat : Object;
		lf.w ? null : lf.w = 25;
		lf.h ? null : lf.h = 25;
		lf.rotate ? null : lf.rotate = 0;
		
		var canvas = document.getElementById(canvasID);
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var gr_w = w - lf.w;
		var gr_h = h - lf.h;
		var bar_w = Math.floor(gr_w / (labelArr.length - 1));
		var lPad =  lf.w + (gr_w - bar_w * (labelArr.length - 1)) / 2;
		
		ctx.lineWidth=2;

		// draw x, y axis
		ctx.beginPath();
		ctx.moveTo(lf.w , 0);
		ctx.lineTo(lf.w , gr_h);
		ctx.lineTo(w, gr_h);
		ctx.stroke();

		// write labels
		var max = valueArr.reduce(function(a, b) {return a > b ? a : b;});
		ctx.fillText(max, 7, 14);
		
		for(var i = 0; i < labelArr.length; i++) {
			ctx.save();
			ctx.translate(lPad + i * bar_w, gr_h + 12);
			ctx.rotate(lf.rotate);
			ctx.textAlign = 'right';
			ctx.fillText(labelArr[i], 0, 0);
			ctx.restore();
		}
		
		// draw lines
		var id_color = 0;
		ctx.save();
		ctx.globalAlpha = 0.8;
		for (var i = 0; i < valueArr.length; i+=labelArr.length) {
			// draw line
			ctx.beginPath();
			ctx.moveTo((lPad),(gr_h - valueArr[i] * gr_h / max));
			for (var j = 1; j < labelArr.length; j++) {
				ctx.lineTo((lPad + j * bar_w),(gr_h - valueArr[i + j] * gr_h / max));
			}
			ctx.strokeStyle = this.colors[id_color % this.colors.length];
			ctx.stroke();

			// draw circles on line
			for (var j = 0; j < labelArr.length; j++) {
				ctx.beginPath();
				ctx.arc((lPad + j * bar_w),(gr_h - valueArr[i + j] * gr_h / max), 3, 0, 2 * Math.PI, true);
				ctx.strokeStyle = this.colors[id_color % this.colors.length];
				ctx.stroke();
			}
			
			id_color++;
		}
		ctx.restore();
	};
	
	/*****************/
	/** Pie graph **/
	/*****************/
	this.drawPieGraph = function(canvasID, valueArr) {
		var canvas = document.getElementById(canvasID);
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var tot = valueArr.reduce(function(a, b) {return a + b;});
		var radSta = 0;
		for (var i = 0; i < valueArr.length; i++) {
			var radEnd = radSta + 2 * Math.PI * valueArr[i] / tot;
			ctx.beginPath();
			ctx.arc(w / 2, h / 2, (w < h ? w : h) / 2, radSta, radEnd);
			ctx.lineTo(w / 2, h / 2);
			ctx.closePath();
			ctx.lineWidth = 1;
			ctx.fillStyle = this.colors[i % this.colors.length];
			ctx.fill();
			ctx.strokeStyle = "#550000";
			ctx.stroke();
			radSta = radEnd;
		}
	};
	
	/*****************/
	/** Bar graph **/
	/*****************/
	this.drawBarGraph = function(divID, labelArr, valueArr) {
		var oDiv = document.getElementById(divID);
		var w = oDiv.offsetWidth;
		var h = oDiv.offsetHeight;
		var lbl_wh = 25;
		var gr_w = w - lbl_wh;
		var gr_h = h - lbl_wh;
		var col_w = Math.floor(gr_w / valueArr.length);
		var lPad = lbl_wh + (gr_w - col_w * valueArr.length) / 2;
		
		var svg = "<svg width='" + w + "' height='" + h + "'>";
		// draw x, y axis
		svg +=    "  <line x1='" + lbl_wh + "' y1='0' x2='" + lbl_wh + "' y2='" + gr_h + "' style='stroke:rgb(5,5,5);stroke-width:1' />";
		svg +=    "  <line x1='" + lbl_wh + "' y1='" + gr_h + "' x2='" + w + "' y2='" + gr_h + "' style='stroke:rgb(5,5,5);stroke-width:1' />";
    
    // write labels
    var max = valueArr.reduce(function(a, b) {return a > b ? a : b;});
    svg +=    "  <text x='0' y='14' fill='black'>" + max + "</text>";
    
    // draw bars
		for (var i = 0; i < valueArr.length; i++) {
      var bar_h = valueArr[i] * gr_h / max;
      var bar_x = lPad + i * col_w + col_w * 0.05; 
			svg +=    "  <rect fill-opacity='0.7' x='" + bar_x + "' y='" + (gr_h - bar_h) + "' " +
                "        width='" + (col_w * 0.9)  + "' height='" + bar_h + "' " +
                "        style='fill:" + this.colors[i % this.colors.length] +";' " +
                "        onmouseover='emphasize(event, this, \"" + labelArr[i] + "\", " + valueArr[i] + ");' onmouseout='getBack(this);' />";
		}
    svg +=    "</svg>";
		oDiv.innerHTML = svg;
		
		
		/*var ctx = canvas.getContext("2d");
		

		// draw bars
		for (var i = 0; i < valueArr.length; i++) {
			ctx.fillStyle = this.colors[i % this.colors.length];
			ctx.fillRect(lPad + i * bar_w, gr_h, bar_w, - valueArr[i] * gr_h / max);
		}*/
	};
	
	this.showColorLabelTable = function(divID, labelArr, limitLen) {
		strHtml = "<table>";
		for (var i = 0; i < labelArr.length; i++) {
			strHtml += "<tr><td bgcolor='" + this.colors[i] + "'>&nbsp;</td>";
			strHtml += "<td>" + (labelArr[i].length > limitLen ? labelArr[i].substring(0, limitLen) : labelArr[i]) + "</td>";
		}
		strHtml += "</table>";
		var div = document.getElementById(divID);
		div.innerHTML = strHtml;
	};
	
	this.showColorLabelValueTable = function(divID, labelArr, limitLen, valueArr) {
		if (labelArr.length != valueArr.length)
			return;
		
		strHtml = "<table>";
		for (var i = 0; i < labelArr.length; i++) {
			strHtml += "<tr><td bgcolor='" + this.colors[i] + "'>&nbsp;</td>";
			strHtml += "<td>" + (labelArr[i].length > limitLen ? labelArr[i].substring(0, limitLen) : labelArr[i]) + "</td>";
			strHtml += "<td>(" + valueArr[i] + ")</td></tr>";
		}
		strHtml += "</table>";
		var div = document.getElementById(divID);
		div.innerHTML = strHtml;
	};
};
