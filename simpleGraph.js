/*************************************************************
 * simpleGraph.js :
 *    Simple Javascript Graph Library
 * 
 *    (c) https://github.com/truemaxdh/simpleGraph.js, 
 *        truemaxdh@gmail.com
 *************************************************************/
function simpleGraph() {
	this.colors = ["#ff0000", "#00ff00", "#0000ff","#aaaa00", "#00aaaa", "#aa00aa","#ffaaaa", "#aaffaa", "#aaaaff"];
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
	this.drawBarGraph = function(canvasID, valueArr) {
		var canvas = document.getElementById(canvasID);
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var lbl_wh = 25;
		var gr_w = w - lbl_wh;
		var gr_h = h - lbl_wh;
		var bar_w = Math.floor(gr_w / valueArr.length);
		var lPad = lbl_wh + (gr_w - bar_w * valueArr.length) / 2;
		
		ctx.lineWidth=2;

		// draw x, y axis
		ctx.beginPath();
		ctx.moveTo(lbl_wh , 0);
		ctx.lineTo(lbl_wh , gr_h);
		ctx.lineTo(w, gr_h);
		ctx.stroke();
		
		// write labels
		var max = valueArr.reduce(function(a, b) {return a > b ? a : b;});
		ctx.fillText(max, 7, 14);

		// draw bars
		for (var i = 0; i < valueArr.length; i++) {
			ctx.fillStyle = this.colors[i % this.colors.length];
			ctx.fillRect(lPad + i * bar_w, gr_h, bar_w, - valueArr[i] * gr_h / max);
		}
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
