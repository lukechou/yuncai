define(["jquery"],function(e){"use strict";var t={digitalCodeConnector:",",errorMsg:"",digitalDescMap:{0:"万位",1:"千位",2:"百位",3:"十位",4:"个位"},maxOneBetMoney:2e4,maxBuyCodeLength:100,maxMultiple:9999,minMultiple:1,maxBetNum:100,minBetNum:1,maxIssueNum:30,minIssueNum:1,ZhiXuanNormal:{minCode:0,maxCode:9,oneBetCodeNum:5,codeRegex:/^([0-9]{1,10}[,]){4}([0-9]{1,10})$/},getLastErrorMsg:function(){return this.errorMsg},getZhiXuanZhushu:function(e,t,r,i,n){var o=Math.getCombineNum(e.length,1),s=Math.getCombineNum(t.length,1),a=Math.getCombineNum(r.length,1),u=Math.getCombineNum(i.length,1),h=Math.getCombineNum(n.length,1);return o*s*a*u*h},produceCode:function(t){for(var r=[],i=this.ZhiXuanNormal.oneBetCodeNum-1;i>=0;){r[i]=[];var n=Math.getRandomInt(this.ZhiXuanNormal.minCode,this.ZhiXuanNormal.maxCode);e.inArray(n,r[i])<0&&(r[i].push(n),i--)}t(r)},isIllegalCode:function(e,t){if(!this.ZhiXuanNormal.codeRegex.test(e))return this.errorMsg="",this.errorMsg+="<h5>请按照正确的格式填写：</h5>",this.errorMsg+="<p>单式：1,2,3,4,5</p>",this.errorMsg+="<p>复式：01,234,35,46,589</p>",!1;for(var r=0,i=[],n=e.split(this.digitalCodeConnector),o=0;o<n.length;o++){var s=n[o].split(""),a={};s.sort(),i[o]=s;for(var u=0;u<s.length;u++){if(a[s[u]])return this.errorMsg=this.digitalDescMap[o]+"重复投注了:"+s[u],!1;a[s[u]]=!0}}return r+=this.getZhiXuanZhushu(n[0].split(""),n[1].split(""),n[2].split(""),n[3].split(""),n[4].split("")),t(i,r),!0}};return t});