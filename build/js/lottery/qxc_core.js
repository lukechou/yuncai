define(["jquery"],function(e){"use strict";var t={digitalCodeConnector:",",errorMsg:"",digitalDescMap:{0:"第一位",1:"第二位",2:"第三位",3:"第四位",4:"第五位",5:"第六位",6:"第七位"},maxOneBetMoney:2e4,maxBuyCodeLength:100,maxMultiple:9999,minMultiple:1,maxBetNum:100,minBetNum:1,maxIssueNum:30,minIssueNum:1,ZhiXuanNormal:{minCode:0,maxCode:9,oneBetCodeNum:7,codeRegex:/^([0-9]{1,10}[,]){6}([0-9]{1,10})$/},getLastErrorMsg:function(){return this.errorMsg},getZhiXuanZhushu:function(e,t,i,r,n,o,h){var s=Math.getCombineNum(e.length,1,"C"),a=Math.getCombineNum(t.length,1,"C"),u=Math.getCombineNum(i.length,1,"C"),m=Math.getCombineNum(r.length,1,"C"),g=Math.getCombineNum(n.length,1,"C"),l=Math.getCombineNum(o.length,1,"C"),C=Math.getCombineNum(h.length,1,"C");return s*a*u*m*g*l*C},produceCode:function(t){for(var i=[],r=this.ZhiXuanNormal.oneBetCodeNum-1;r>=0;){i[r]=[];var n=Math.getRandomInt(this.ZhiXuanNormal.minCode,this.ZhiXuanNormal.maxCode);e.inArray(n,i[r])<0&&(i[r].push(n),r--)}t(i)},isIllegalCode:function(e,t){if(!this.ZhiXuanNormal.codeRegex.test(e))return this.errorMsg="",this.errorMsg+="<h5>请按照正确的格式填写：</h5>",this.errorMsg+="<p>单式：1,2,3,4,5,6,7</p>",this.errorMsg+="<p>复式：01,12,34,45,5,6,7</p>",!1;for(var i=0,r=[],n=e.split(this.digitalCodeConnector),o=0;o<n.length;o++){var h=n[o].split(""),s={};h.sort(),r[o]=h;for(var a=0;a<h.length;a++){if(s[h[a]])return this.errorMsg=this.digitalDescMap[o]+"重复投注了:"+h[a],!1;s[h[a]]=!0}}return i+=this.getZhiXuanZhushu(n[0].split(""),n[1].split(""),n[2].split(""),n[3].split(""),n[4].split(""),n[5].split(""),n[6].split("")),t(r,i),!0}};return t});