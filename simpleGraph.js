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

function emphasizeLine(clsName) {
  var clsObjs = document.getElementsByClassName(clsName);
  Array.from(clsObjs).forEach(function (item, idx) {item.style.strokeWidth=2});
}

function getBackLine(clsName) {
  var clsObjs = document.getElementsByClassName(clsName);
  Array.from(clsObjs).forEach(function (item, idx) {item.style.strokeWidth=1});
}

function emphasizePoint(evt, obj, lbl, val, clsName) {
  emphasize(evt, obj, lbl, val);
  emphasizeLine(clsName);
}

function getBackPoint(obj, clsName) {
  getBack(obj);
  getBackLine(clsName);
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
	this.drawLineGraph = function(divID, labelArr, valueArr, labelFormat) {
		if ((valueArr.length % labelArr.length) != 0)
			return;
		
		var lf = labelFormat ? labelFormat : Object;
		lf.w ? null : lf.w = 25;
		lf.h ? null : lf.h = 25;
		lf.rotate ? null : lf.rotate = 0;
		
		var oDiv = document.getElementById(divID);
		var w = oDiv.offsetWidth;
		var h = oDiv.offsetHeight;
		var gr_w = w - lf.w;
		var gr_h = h - lf.h;
		var bar_w = Math.floor(gr_w / (labelArr.length - 1));
		var lPad =  lf.w + (gr_w - bar_w * (labelArr.length - 1)) / 2;

		var svg = "<svg width='" + w + "' height='" + h + "'>";
		
		// draw x, y axis
		svg += "  <polyline points='" + lf.w + " 0, " + lf.w + " " + gr_h + ", " + w + ", " + gr_h + "' " +
           "     stroke='#050505' fill='transparent' stroke-width='1' />";
		
	    // write labels
		var max = 1;
	    try {
	    	max = valueArr.reduce(function(a, b) {return a > b ? a : b;});	
	    } catch(ex) {}
		max = (max <= 0) ? 1: max;
	    
		svg += "  <text x='0' y='14' fill='black'>" + max + "</text>";
	    
		for(var i = 0; i < labelArr.length; i++) {
			svg += "  <g transform='translate(" + (lPad + i * bar_w) + "," + (gr_h + 12) + ")'>";
			svg += "  <g transform='rotate(" + lf.rotate + ")'>";
			svg += "  <text x='0' y='0' fill='black' text-anchor='end' style='font-size:12px'>" + labelArr[i] + "</text>";
			svg += "  </g></g>";
		}		
		
		// draw lines & circles
		var id_color = 0;
		var svg_pt = "";
			
		for (var i = 0; i < valueArr.length; i+=labelArr.length) {
			// draw line
			var svg_line = "";
			
			var x1 = lPad;
			var y1 = gr_h - valueArr[i] * gr_h / max;
			svg_pt += "  <circle class='" + divID + i + "' cx='" + x1 + "' cy='" + y1 + "' r='4' " +
               "   stroke='" + this.colors[id_color] + "' fill='white' stroke-width='1' " +
               "   onmouseover='emphasizePoint(event, this, \"" + labelArr[0] + "\", " + valueArr[i] + ", \"" + (divID + i) + "\");' " +
               "   onmouseout='getBackPoint(this,  \"" + (divID + i) + "\");' />";
			for (var j = 1; j < labelArr.length; j++) {
				var x2 = (lPad + j * bar_w);
				var y2 = (gr_h - valueArr[i + j] * gr_h / max);
				// draw line
				svg +=    "  <line class='" + divID + i + "' x1='" + x1 + "' y1='" + y1 + "' x2='" + x2 + "' y2='" + y2 + "' " +
				"   style='stroke:" + this.colors[id_color % this.colors.length] + ";stroke-width:1' " +
				"   onmouseover='emphasizeLine(\"" + divID + i + "\");' onmouseout='getBackLine(\"" + divID + i + "\");' />";
				x1 = x2;
				y1 = y2;
				
				// draw circle
				svg_pt += "  <circle class='" + divID + i + "' cx='" + x2 + "' cy='" + y2 + "' r='4' " +
				"   stroke='" + this.colors[id_color % this.colors.length] + "' fill='white' stroke-width='1' " +
				"   onmouseover='emphasizePoint(event, this, \"" + labelArr[j] + "\", " + valueArr[i+j] + ", \"" + (divID + i) + "\");' " +
				"   onmouseout='getBackPoint(this,  \"" + (divID + i) + "\");' />";
			}
			
			id_color++;
		}
		svg += svg_pt;
		svg +=    "</svg>";
		oDiv.innerHTML = svg;
		
	};
	
	/*****************/
	/** Pie graph **/
	/*****************/
	this.drawPieGraph = function(divID, labelArr, valueArr) {
		var oDiv = document.getElementById(divID);
		var w = oDiv.offsetWidth;
		var h = oDiv.offsetHeight;
		var r = (w < h ? w : h) / 2;
		var tot = 1;
		try {
			tot = valueArr.reduce(function(a, b) {return a + b;});	
		} catch(ex) {}
		tot = (tot <= 0) ? 1: tot;
		var radSta = 0;
		var staPtX = w;
		var staPtY = h / 2;
		var svg = "<svg width='" + w + "' height='" + h + "'>";
		for (var i = 0; i < valueArr.length; i++) {
			var per = valueArr[i] / tot;
			per = (per == 1) ? 0.9999: per;
	
			var radEnd = radSta + 2 * Math.PI * per;
			var endPtX = w / 2 + r * Math.cos(radEnd);
			var endPtY = h / 2 + r * Math.sin(radEnd);
			var flag1 = (per > 0.5) ? 1 : 0;
      
			svg += "  <path fill-opacity='0.7' d='M" + staPtX + " " + staPtY + 
			"           A " + r + " " + r + ", 0, " + flag1 + ", 1, " + endPtX + " " + endPtY +
			"           L " + (w / 2) + " " + (h / 2) + 
			"           Z' fill='" + this.colors[i % this.colors.length] + "' " + 
			"        onmouseover='emphasize(event, this, \"" + labelArr[i] + "\", " + valueArr[i] + ");' onmouseout='getBack(this);' />";
			staPtX = endPtX;
			staPtY = endPtY;
			radSta = radEnd;
		}
		svg +=    "</svg>";
		oDiv.innerHTML = svg;
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
		var max = 1;
		try {
			max = valueArr.reduce(function(a, b) {return a > b ? a : b;});
		} catch(ex) {}
		max = (max <= 0) ? 1: max;
    
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
