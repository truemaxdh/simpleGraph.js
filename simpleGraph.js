
function simpleGraph() {
	this.colors = ["#ff0000", "#00ff00", "#0000ff","#aaaa00", "#00aaaa", "#aa00aa","#ffaaaa", "#aaffaa", "#aaaaff"];
	this.setColors = function(colors) {
		this.colors = colors;
	};
	
	this.drawLineGraph = function(canvasID, labelArr, valueArr) {
		if ((valueArr.length % labelArr.length) != 0)
			return;
		
		var canvas = document.getElementById(canvasID);
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;
		var lbl_wh = 25;
		var gr_w = w - lbl_wh;
		var gr_h = h - lbl_wh;
		var bar_w = Math.floor(gr_w / labelArr.length);
		var lPad = lbl_wh + (gr_w - bar_w * labelArr.length) / 2;
		
		ctx.lineWidth=2;

		// x, y 축 그리기
		ctx.beginPath();
		ctx.moveTo(lbl_wh , 0);
		ctx.lineTo(lbl_wh , gr_h);
		ctx.lineTo(w, gr_h);
		ctx.stroke();

		// 라벨 쓰기
		var max = valueArr.reduce(function(a, b) {return a > b ? a : b;});
		for(var i = 0; i < labelArr.length; i++) {
			ctx.fillText(labelArr[i], (lPad + i * bar_w - 7), h);
		}
		ctx.fillText(max, 7, 14);
		
		// 선 그리기
		var id_color = 0;
		for (var i = 0; i < valueArr.length; i+=labelArr.length) {
			ctx.beginPath();
			ctx.moveTo((lPad),(gr_h - valueArr[i] * gr_h / max));
			for (var j = 1; j < labelArr.length; j++) {
				ctx.lineTo((lPad + j * bar_w),(gr_h - valueArr[i + j] * gr_h / max));
				ctx.strokeStyle = this.colors[id_color % this.colors.length];
				ctx.stroke();
			}			
			id_color++;
		}
	};
	
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
