/*
 * Syn - 3.3.1
 * 
 * Copyright (c) 2013 Bitovi
 * Tue, 08 Oct 2013 00:20:41 GMT
 * Licensed MIT */
dojo.provide("Hotkey.widget.syn");
!function(l){var s=function(){var a=l.Syn?l.Syn:{},f=function(a,b){for(var c in b)a[c]=b[c];return a},n={msie:!(!l.attachEvent||l.opera),opera:!!l.opera,webkit:-1<navigator.userAgent.indexOf("AppleWebKit/"),safari:-1<navigator.userAgent.indexOf("AppleWebKit/")&&-1===navigator.userAgent.indexOf("Chrome/"),gecko:-1<navigator.userAgent.indexOf("Gecko"),mobilesafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/),rhino:navigator.userAgent.match(/Rhino/)&&!0},q=function(a,b,c){a=c.ownerDocument.createEventObject();
return f(a,b)},g={},c=1,d="_synthetic"+(new Date).getTime(),e,k,b=/keypress|keyup|keydown/,m=/load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll/,r,h=function(a,b,c,d){return new h.init(a,b,c,d)};h.config=a;e=function(a,b,c){return a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent("on"+b,c)};k=function(a,b,c){return a.addEventListener?a.removeEventListener(b,c,!1):a.detachEvent("on"+b,c)};f(h,{init:function(a,b,c,d){var e=h.args(b,c,d),k=this;this.queue=[];this.element=
e.element;if("function"===typeof this[a])this[a](e.options,e.element,function(a,b){e.callback&&e.callback.apply(k,arguments);k.done.apply(k,arguments)});else this.result=h.trigger(a,e.options,e.element),e.callback&&e.callback.call(this,e.element,this.result)},jquery:function(a,b){return l.FuncUnit&&l.FuncUnit.jQuery?l.FuncUnit.jQuery:a?h.helpers.getWindow(a).jQuery||l.jQuery:l.jQuery},args:function(){for(var a={},b=0;b<arguments.length;b++)"function"===typeof arguments[b]?a.callback=arguments[b]:
arguments[b]&&arguments[b].jquery?a.element=arguments[b][0]:arguments[b]&&arguments[b].nodeName?a.element=arguments[b]:a.options&&"string"===typeof arguments[b]?a.element=document.getElementById(arguments[b]):arguments[b]&&(a.options=arguments[b]);return a},click:function(a,b,c){h("click!",a,b,c)},defaults:{focus:function(){if(!h.support.focusChanges){var a=this,b=a.nodeName.toLowerCase();h.data(a,"syntheticvalue",a.value);"input"!==b&&"textarea"!==b||e(a,"blur",function(){h.data(a,"syntheticvalue")!=
a.value&&h.trigger("change",{},a);k(a,"blur",arguments.callee)})}},submit:function(){h.onParents(this,function(a){if("form"===a.nodeName.toLowerCase())return a.submit(),!1})}},changeOnBlur:function(a,b,c){e(a,"blur",function(){c!==a[b]&&h.trigger("change",{},a);k(a,"blur",arguments.callee)})},closest:function(a,b){for(;a&&a.nodeName.toLowerCase()!==b.toLowerCase();)a=a.parentNode;return a},data:function(a,b,e){a[d]||(a[d]=c++);g[a[d]]||(g[a[d]]={});if(e)g[a[d]][b]=e;else return g[a[d]][b]},onParents:function(a,
b){for(var c;a&&!1!==c;)c=b(a),a=a.parentNode;return a},focusable:/^(a|area|frame|iframe|label|input|select|textarea|button|html|object)$/i,isFocusable:function(a){var b;a.getAttributeNode&&(b=a.getAttributeNode("tabIndex"));return this.focusable.test(a.nodeName)||b&&b.specified&&h.isVisible(a)},isVisible:function(a){return a.offsetWidth&&a.offsetHeight||a.clientWidth&&a.clientHeight},tabIndex:function(a){var b=a.getAttributeNode("tabIndex");return b&&b.specified&&(parseInt(a.getAttribute("tabIndex"))||
0)},bind:e,unbind:k,browser:n,helpers:{createEventObject:q,createBasicStandardEvent:function(a,b,c){var d;try{d=c.createEvent("Events")}catch(e){d=c.createEvent("UIEvents")}finally{d.initEvent(a,!0,!0),f(d,b)}return d},inArray:function(a,b){for(var c=0;c<b.length;c++)if(b[c]===a)return c;return-1},getWindow:function(a){if(a.ownerDocument)return a.ownerDocument.defaultView||a.ownerDocument.parentWindow},extend:f,scrollOffset:function(a,b){var c=a.document.documentElement,d=a.document.body;if(b)l.scrollTo(b.left,
b.top);else return{left:(c&&c.scrollLeft||d&&d.scrollLeft||0)+(c.clientLeft||0),top:(c&&c.scrollTop||d&&d.scrollTop||0)+(c.clientTop||0)}},scrollDimensions:function(a){var b=a.document.documentElement,c=a.document.body,d=b.clientWidth,b=b.clientHeight;a="CSS1Compat"===a.document.compatMode;return{height:a&&b||c.clientHeight||b,width:a&&d||c.clientWidth||d}},addOffset:function(a,b){var c=h.jquery(b);"object"===typeof a&&void 0===a.clientX&&void 0===a.clientY&&void 0===a.pageX&&void 0===a.pageY&&c&&
(b=c(b),c=b.offset(),a.pageX=c.left+b.width()/2,a.pageY=c.top+b.height()/2)}},key:{ctrlKey:null,altKey:null,shiftKey:null,metaKey:null},dispatch:function(a,b,c,d){if(b.dispatchEvent&&a){var h=a.preventDefault,m=d?-1:0;d&&e(b,c,function(a){a.preventDefault();k(this,c,arguments.callee)});a.preventDefault=function(){m++;0<++m&&h.apply(this,[])};b.dispatchEvent(a);return 0>=m}try{l.event=a}catch(g){}return 0>=b.sourceIndex||b.fireEvent&&b.fireEvent("on"+c,a)},create:{page:{event:function(a,b,c){var d=
h.helpers.getWindow(c).document||document,e;if(d.createEvent)e=d.createEvent("Events"),e.initEvent(a,!0,!0);else try{e=q(a,b,c)}catch(k){}return e}},focus:{event:function(a,b,c){h.onParents(c,function(a){if(h.isFocusable(a))return"html"!==a.nodeName.toLowerCase()?(a.focus(),r=a):r&&(a=h.helpers.getWindow(c).document,a===l.document&&(a.activeElement?a.activeElement.blur():r.blur(),r=null)),!1});return!0}}},support:{clickChanges:!1,clickSubmits:!1,keypressSubmits:!1,mouseupSubmits:!1,radioClickChanges:!1,
focusChanges:!1,linkHrefJS:!1,keyCharacters:!1,backspaceWorks:!1,mouseDownUpClicks:!1,tabKeyTabs:!1,keypressOnAnchorClicks:!1,optionClickBubbles:!1,ready:0},trigger:function(a,c,d){c||(c={});var e=h.create,k=e[a]&&e[a].setup,g=b.test(a)?"key":m.test(a)?"page":"mouse",f=e[a]||{},g=e[g],e=d;2===h.support.ready&&k&&k(a,c,d);k=c._autoPrevent;delete c._autoPrevent;f.event?f=f.event(a,c,d):(c=g.options?g.options(a,c,d):c,!h.support.changeBubbles&&/option/i.test(d.nodeName)&&(e=d.parentNode),f=g.event(a,
c,e),f=h.dispatch(f,e,a,k));f&&2===h.support.ready&&h.defaults[a]&&h.defaults[a].call(d,c,k);return f},eventSupported:function(a){var b=document.createElement("div");a="on"+a;var c=a in b;c||(b.setAttribute(a,"return;"),c="function"===typeof b[a]);return c}});f(h.init.prototype,{then:function(a,b,c,d){h.autoDelay&&this.delay();var e=h.args(b,c,d),k=this;this.queue.unshift(function(b,c){if("function"===typeof this[a])this.element=e.element||b,this[a](e.options,this.element,function(a,b){e.callback&&
e.callback.apply(k,arguments);k.done.apply(k,arguments)});else return this.result=h.trigger(a,e.options,e.element),e.callback&&e.callback.call(this,e.element,this.result),this});return this},delay:function(a,b){"function"===typeof a&&(b=a,a=null);a=a||600;var c=this;this.queue.unshift(function(){setTimeout(function(){b&&b.apply(c,[]);c.done.apply(c,arguments)},a)});return this},done:function(a,b){b&&(this.element=b);this.queue.length&&this.queue.pop().call(this,this.element,a)},_click:function(a,
b,c,d){h.helpers.addOffset(a,b);h.trigger("mousedown",a,b);setTimeout(function(){h.trigger("mouseup",a,b);!h.support.mouseDownUpClicks||d?(h.trigger("click",a,b),c(!0)):(h.create.click.setup("click",a,b),h.defaults.click.call(b),setTimeout(function(){c(!0)},1))},1)},_rightClick:function(a,b,c){h.helpers.addOffset(a,b);var d=f(f({},h.mouse.browser.right.mouseup),a);h.trigger("mousedown",d,b);setTimeout(function(){h.trigger("mouseup",d,b);h.mouse.browser.right.contextmenu&&h.trigger("contextmenu",f(f({},
h.mouse.browser.right.contextmenu),a),b);c(!0)},1)},_dblclick:function(a,b,c){h.helpers.addOffset(a,b);var d=this;this._click(a,b,function(){setTimeout(function(){d._click(a,b,function(){h.trigger("dblclick",a,b);c(!0)},!0)},2)})}});for(var a="click dblclick move drag key type rightClick".split(" "),n=function(a){h[a]=function(b,c,d){return h("_"+a,b,c,d)};h.init.prototype[a]=function(b,c,d){return this.then("_"+a,b,c,d)}},p=0;p<a.length;p++)n(a[p]);return h}(),t=function(a){var f=a.helpers,n=f.getWindow;
a.mouse={};f.extend(a.defaults,{mousedown:function(f){a.trigger("focus",{},this)},click:function(){var f,g,c,d,e;try{f=this.href,g=this.type,createChange=a.data(this,"createChange"),c=a.data(this,"radioChanged"),e=n(this),d=this.nodeName.toLowerCase()}catch(k){return}if(!a.support.linkHrefJS&&/^\s*javascript:/.test(f)){var b=f.replace(/^\s*javascript:/,"");"//"!=b&&-1==b.indexOf("void(0)")&&(l.selenium?eval("with(selenium.browserbot.getCurrentWindow()){"+b+"}"):eval("with(scope){"+b+"}"))}(!a.support.clickSubmits&&
"input"==d&&"submit"==g||"button"==d)&&(b=a.closest(this,"form"))&&a.trigger("submit",{},b);"a"==d&&this.href&&!/^\s*javascript:/.test(f)&&(e.location.href=f);"input"==d&&"checkbox"==g&&(a.support.clickChanges||a.trigger("change",{},this));"input"==d&&"radio"==g&&c&&!a.support.radioClickChanges&&a.trigger("change",{},this);"option"==d&&createChange&&(a.trigger("change",{},this.parentNode),a.data(this,"createChange",!1))}});f.extend(a.create,{mouse:{options:function(q,g,c){c=document.documentElement;
var d=document.body,e=[g.pageX||0,g.pageY||0],k=a.mouse.browser&&a.mouse.browser.left[q],b=a.mouse.browser&&a.mouse.browser.right[q];return f.extend({bubbles:!0,cancelable:!0,view:l,detail:1,screenX:1,screenY:1,clientX:g.clientX||e[0]-(c&&c.scrollLeft||d&&d.scrollLeft||0)-(c.clientLeft||0),clientY:g.clientY||e[1]-(c&&c.scrollTop||d&&d.scrollTop||0)-(c.clientTop||0),ctrlKey:!!a.key.ctrlKey,altKey:!!a.key.altKey,shiftKey:!!a.key.shiftKey,metaKey:!!a.key.metaKey,button:k&&null!=k.button?k.button:b&&
b.button||("contextmenu"==q?2:0),relatedTarget:document.documentElement},g)},event:function(a,g,c){var d=n(c).document||document;if(d.createEvent){var e;try{e=d.createEvent("MouseEvents"),e.initMouseEvent(a,g.bubbles,g.cancelable,g.view,g.detail,g.screenX,g.screenY,g.clientX,g.clientY,g.ctrlKey,g.altKey,g.shiftKey,g.metaKey,g.button,g.relatedTarget)}catch(k){e=f.createBasicStandardEvent(a,g,d)}e.synthetic=!0}else try{e=f.createEventObject(a,g,c)}catch(b){}return e}},click:{setup:function(f,g,c){g=
c.nodeName.toLowerCase();if(!a.support.clickChecks&&!a.support.changeChecks&&"input"===g&&(f=c.type.toLowerCase(),"checkbox"===f&&(c.checked=!c.checked),"radio"===f&&!c.checked)){try{a.data(c,"radioChanged",!0)}catch(d){}c.checked=!0}"a"==g&&c.href&&!/^\s*javascript:/.test(c.href)&&a.data(c,"href",c.href);if(/option/i.test(c.nodeName)){f=c.parentNode.firstChild;for(g=-1;f&&(1!=f.nodeType||(g++,f!=c));)f=f.nextSibling;g!==c.parentNode.selectedIndex&&(c.parentNode.selectedIndex=g,a.data(c,"createChange",
!0))}}},mousedown:{setup:function(f,g,c){f=c.nodeName.toLowerCase();!a.browser.safari||"select"!=f&&"option"!=f||(g._autoPrevent=!0)}}});(function(){if(document.body){var f=l.__synthTest;l.__synthTest=function(){a.support.linkHrefJS=!0};var g=document.createElement("div"),c,d,e,k;g.innerHTML="<form id='outer'><input name='checkbox' type='checkbox'/><input name='radio' type='radio' /><input type='submit' name='submitter'/><input type='input' name='inputter'/><input name='one'><input name='two'/><a href='javascript:__synthTest()' id='synlink'></a><select><option></option></select></form>";
document.documentElement.appendChild(g);e=g.firstChild;c=e.childNodes[0];d=e.childNodes[2];k=e.getElementsByTagName("select")[0];c.checked=!1;c.onchange=function(){a.support.clickChanges=!0};a.trigger("click",{},c);a.support.clickChecks=c.checked;c.checked=!1;a.trigger("change",{},c);a.support.changeChecks=c.checked;e.onsubmit=function(b){b.preventDefault&&b.preventDefault();a.support.clickSubmits=!0;return!1};a.trigger("click",{},d);e.childNodes[1].onchange=function(){a.support.radioClickChanges=
!0};a.trigger("click",{},e.childNodes[1]);a.bind(g,"click",function(){a.support.optionClickBubbles=!0;a.unbind(g,"click",arguments.callee)});a.trigger("click",{},k.firstChild);a.support.changeBubbles=a.eventSupported("change");g.onclick=function(){a.support.mouseDownUpClicks=!0};a.trigger("mousedown",{},g);a.trigger("mouseup",{},g);document.documentElement.removeChild(g);l.__synthTest=f;a.support.ready++}else setTimeout(arguments.callee,1)})();return a}(s),u=function(a){a.key.browsers={webkit:{prevent:{keyup:[],
keydown:["char","keypress"],keypress:["char"]},character:{keydown:[0,"key"],keypress:["char","char"],keyup:[0,"key"]},specialChars:{keydown:[0,"char"],keyup:[0,"char"]},navigation:{keydown:[0,"key"],keyup:[0,"key"]},special:{keydown:[0,"key"],keyup:[0,"key"]},tab:{keydown:[0,"char"],keyup:[0,"char"]},"pause-break":{keydown:[0,"key"],keyup:[0,"key"]},caps:{keydown:[0,"key"],keyup:[0,"key"]},escape:{keydown:[0,"key"],keyup:[0,"key"]},"num-lock":{keydown:[0,"key"],keyup:[0,"key"]},"scroll-lock":{keydown:[0,
"key"],keyup:[0,"key"]},print:{keyup:[0,"key"]},"function":{keydown:[0,"key"],keyup:[0,"key"]},"\r":{keydown:[0,"key"],keypress:["char","key"],keyup:[0,"key"]}},gecko:{prevent:{keyup:[],keydown:["char"],keypress:["char"]},character:{keydown:[0,"key"],keypress:["char",0],keyup:[0,"key"]},specialChars:{keydown:[0,"key"],keypress:[0,"key"],keyup:[0,"key"]},navigation:{keydown:[0,"key"],keypress:[0,"key"],keyup:[0,"key"]},special:{keydown:[0,"key"],keyup:[0,"key"]},"\t":{keydown:[0,"key"],keypress:[0,
"key"],keyup:[0,"key"]},"pause-break":{keydown:[0,"key"],keypress:[0,"key"],keyup:[0,"key"]},caps:{keydown:[0,"key"],keyup:[0,"key"]},escape:{keydown:[0,"key"],keypress:[0,"key"],keyup:[0,"key"]},"num-lock":{keydown:[0,"key"],keyup:[0,"key"]},"scroll-lock":{keydown:[0,"key"],keyup:[0,"key"]},print:{keyup:[0,"key"]},"function":{keydown:[0,"key"],keyup:[0,"key"]},"\r":{keydown:[0,"key"],keypress:[0,"key"],keyup:[0,"key"]}},msie:{prevent:{keyup:[],keydown:["char","keypress"],keypress:["char"]},character:{keydown:[null,
"key"],keypress:[null,"char"],keyup:[null,"key"]},specialChars:{keydown:[null,"char"],keyup:[null,"char"]},navigation:{keydown:[null,"key"],keyup:[null,"key"]},special:{keydown:[null,"key"],keyup:[null,"key"]},tab:{keydown:[null,"char"],keyup:[null,"char"]},"pause-break":{keydown:[null,"key"],keyup:[null,"key"]},caps:{keydown:[null,"key"],keyup:[null,"key"]},escape:{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,"key"]},"num-lock":{keydown:[null,"key"],keyup:[null,"key"]},"scroll-lock":{keydown:[null,
"key"],keyup:[null,"key"]},print:{keyup:[null,"key"]},"function":{keydown:[null,"key"],keyup:[null,"key"]},"\r":{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,"key"]}},opera:{prevent:{keyup:[],keydown:[],keypress:["char"]},character:{keydown:[null,"key"],keypress:[null,"char"],keyup:[null,"key"]},specialChars:{keydown:[null,"char"],keypress:[null,"char"],keyup:[null,"char"]},navigation:{keydown:[null,"key"],keypress:[null,"key"]},special:{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,
"key"]},tab:{keydown:[null,"char"],keypress:[null,"char"],keyup:[null,"char"]},"pause-break":{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,"key"]},caps:{keydown:[null,"key"],keyup:[null,"key"]},escape:{keydown:[null,"key"],keypress:[null,"key"]},"num-lock":{keyup:[null,"key"],keydown:[null,"key"],keypress:[null,"key"]},"scroll-lock":{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,"key"]},print:{},"function":{keydown:[null,"key"],keypress:[null,"key"],keyup:[null,"key"]},"\r":{keydown:[null,
"key"],keypress:[null,"key"],keyup:[null,"key"]}}};a.mouse.browsers={webkit:{right:{mousedown:{button:2,which:3},mouseup:{button:2,which:3},contextmenu:{button:2,which:3}},left:{mousedown:{button:0,which:1},mouseup:{button:0,which:1},click:{button:0,which:1}}},opera:{right:{mousedown:{button:2,which:3},mouseup:{button:2,which:3}},left:{mousedown:{button:0,which:1},mouseup:{button:0,which:1},click:{button:0,which:1}}},msie:{right:{mousedown:{button:2},mouseup:{button:2},contextmenu:{button:0}},left:{mousedown:{button:1},
mouseup:{button:1},click:{button:0}}},chrome:{right:{mousedown:{button:2,which:3},mouseup:{button:2,which:3},contextmenu:{button:2,which:3}},left:{mousedown:{button:0,which:1},mouseup:{button:0,which:1},click:{button:0,which:1}}},gecko:{left:{mousedown:{button:0,which:1},mouseup:{button:0,which:1},click:{button:0,which:1}},right:{mousedown:{button:2,which:3},mouseup:{button:2,which:3},contextmenu:{button:2,which:3}}}};a.key.browser=function(){if(a.key.browsers[l.navigator.userAgent])return a.key.browsers[l.navigator.userAgent];
for(var f in a.browser)if(a.browser[f]&&a.key.browsers[f])return a.key.browsers[f];return a.key.browsers.gecko}();a.mouse.browser=function(){if(a.mouse.browsers[l.navigator.userAgent])return a.mouse.browsers[l.navigator.userAgent];for(var f in a.browser)if(a.browser[f]&&a.mouse.browsers[f])return a.mouse.browsers[f];return a.mouse.browsers.gecko}();return a}(s,t),y=function(a){var f=a.helpers,n=function(a){if(void 0!==a.selectionStart)return document.activeElement&&document.activeElement!=a&&a.selectionStart==
a.selectionEnd&&0==a.selectionStart?{start:a.value.length,end:a.value.length}:{start:a.selectionStart,end:a.selectionEnd};try{if("input"==a.nodeName.toLowerCase()){var d=f.getWindow(a).document.selection.createRange(),e=a.createTextRange();e.setEndPoint("EndToStart",d);var k=e.text.length;return{start:k,end:k+d.text.length}}var d=f.getWindow(a).document.selection.createRange(),e=d.duplicate(),b=d.duplicate(),m=d.duplicate();b.collapse();m.collapse(!1);b.moveStart("character",-1);m.moveStart("character",
-1);e.moveToElementText(a);e.setEndPoint("EndToEnd",d);var k=e.text.length-d.text.length,g=e.text.length;0!=k&&""==b.text&&(k+=2);0!=g&&""==m.text&&(g+=2);return{start:k,end:g}}catch(h){return{start:a.value.length,end:a.value.length}}},q=function(c){c=f.getWindow(c).document;for(var d=[],e=c.getElementsByTagName("*"),k=e.length,b=0;b<k;b++)a.isFocusable(e[b])&&e[b]!=c.documentElement&&d.push(e[b]);return d};f.extend(a,{keycodes:{"\b":8,"\t":9,"\r":13,shift:16,ctrl:17,alt:18,"pause-break":19,caps:20,
escape:27,"num-lock":144,"scroll-lock":145,print:44,"page-up":33,"page-down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,"delete":46," ":32,0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:78,o:79,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90,num0:96,num1:97,num2:98,num3:99,num4:100,num5:101,num6:102,num7:103,num8:104,num9:105,"*":106,"+":107,"-":109,".":110,"/":111,";":186,"=":187,",":188,"-":189,".":190,
"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222,"left window key":91,"right window key":92,"select key":93,f1:112,f2:113,f3:114,f4:115,f5:116,f6:117,f7:118,f8:119,f9:120,f10:121,f11:122,f12:123},typeable:/input|textarea/i,selectText:function(a,d,e){if(a.setSelectionRange)e?(a.selectionStart=d,a.selectionEnd=e):(a.focus(),a.setSelectionRange(d,d));else if(a.createTextRange){var f=a.createTextRange();f.moveStart("character",d);f.moveEnd("character",(e||d)-a.value.length);f.select()}},getText:function(c){if(a.typeable.test(c.nodeName)){var d=
n(c);return c.value.substring(d.start,d.end)}c=a.helpers.getWindow(c);return c.getSelection?c.getSelection().toString():c.document.getSelection?c.document.getSelection().toString():c.document.selection.createRange().text},getSelection:n});f.extend(a.key,{data:function(c){if(a.key.browser[c])return a.key.browser[c];for(var d in a.key.kinds)if(-1<f.inArray(c,a.key.kinds[d]))return a.key.browser[d];return a.key.browser.character},isSpecial:function(c){for(var d=a.key.kinds.special,e=0;e<d.length;e++)if(a.keycodes[d[e]]==
c)return d[e]},options:function(c,d){var e=a.key.data(c);if(!e[d])return null;var f=e[d][0],e=e[d][1],b={};b.keyCode="key"==e?a.keycodes[c]:"char"==e?c.charCodeAt(0):e;"char"==f?b.charCode=c.charCodeAt(0):null!==f&&(b.charCode=f);b.which=b.keyCode?b.keyCode:b.charCode;return b},kinds:{special:["shift","ctrl","alt","caps"],specialChars:["\b"],navigation:"page-up page-down end home left up right down insert delete".split(" "),"function":"f1 f2 f3 f4 f5 f6 f7 f8 f9 f10 f11 f12".split(" ")},getDefault:function(c){if(a.key.defaults[c])return a.key.defaults[c];
for(var d in a.key.kinds)if(-1<f.inArray(c,a.key.kinds[d])&&a.key.defaults[d])return a.key.defaults[d];return a.key.defaults.character},defaults:{character:function(c,d,e,f,b){/num\d+/.test(e)&&(e=e.match(/\d+/)[0]);if(f||!a.support.keyCharacters&&a.typeable.test(this.nodeName))d=this.value,c=d.substr(0,b.start),b=d.substr(b.end),this.value=c+e+b,a.selectText(this,c.length+("\n"==e&&a.support.textareaCarriage?2:e.length))},c:function(c,d,e,f,b){a.key.ctrlKey?a.key.clipboard=a.getText(this):a.key.defaults.character.apply(this,
arguments)},v:function(c,d,e,f,b){a.key.ctrlKey?a.key.defaults.character.call(this,c,d,a.key.clipboard,!0,b):a.key.defaults.character.apply(this,arguments)},a:function(c,d,e,f,b){a.key.ctrlKey?a.selectText(this,0,this.value.length):a.key.defaults.character.apply(this,arguments)},home:function(){a.onParents(this,function(a){if(a.scrollHeight!=a.clientHeight)return a.scrollTop=0,!1})},end:function(){a.onParents(this,function(a){if(a.scrollHeight!=a.clientHeight)return a.scrollTop=a.scrollHeight,!1})},
"page-down":function(){a.onParents(this,function(a){if(a.scrollHeight!=a.clientHeight)return a.scrollTop+=a.clientHeight,!1})},"page-up":function(){a.onParents(this,function(a){if(a.scrollHeight!=a.clientHeight)return a.scrollTop-=a.clientHeight,!1})},"\b":function(c,d,e,f,b){!a.support.backspaceWorks&&a.typeable.test(this.nodeName)&&(d=this.value,c=d.substr(0,b.start),d=d.substr(b.end),b.start==b.end&&0<b.start?(this.value=c.substring(0,c.length-1)+d,a.selectText(this,b.start-1)):(this.value=c+d,
a.selectText(this,b.start)))},"delete":function(c,d,e,f,b){!a.support.backspaceWorks&&a.typeable.test(this.nodeName)&&(d=this.value,c=d.substr(0,b.start),d=d.substr(b.end),this.value=b.start==b.end&&b.start<=this.value.length-1?c+d.substring(1):c+d,a.selectText(this,b.start))},"\r":function(c,d,e,f,b){e=this.nodeName.toLowerCase();"input"==e&&a.trigger("change",{},this);a.support.keypressSubmits||"input"!=e||(f=a.closest(this,"form"))&&a.trigger("submit",{},f);a.support.keyCharacters||"textarea"!=
e||a.key.defaults.character.call(this,c,d,"\n",void 0,b);a.support.keypressOnAnchorClicks||"a"!=e||a.trigger("click",{},this)},"\t":function(c,d){var e=q(this);a.tabIndex(this);var f=null,b=0,m;for(orders=[];b<e.length;b++)orders.push([e[b],b]);orders.sort(function(b,c){var d=c[0],e=a.tabIndex(b[0])||0,d=a.tabIndex(d)||0;return e==d?b[1]-c[1]:0==e?1:0==d?-1:e-d});for(b=0;b<orders.length;b++)m=orders[b][0],this==m&&(a.key.shiftKey?(f=orders[b-1][0])||(f=orders[e.length-1][0]):(f=orders[b+1][0])||(f=
orders[0][0]));f||(f=void 0);f&&f.focus();return f},left:function(c,d,e,f,b){a.typeable.test(this.nodeName)&&(a.key.shiftKey?a.selectText(this,0==b.start?0:b.start-1,b.end):a.selectText(this,0==b.start?0:b.start-1))},right:function(c,d,e,f,b){a.typeable.test(this.nodeName)&&(a.key.shiftKey?a.selectText(this,b.start,b.end+1>this.value.length?this.value.length:b.end+1):a.selectText(this,b.end+1>this.value.length?this.value.length:b.end+1))},up:function(){/select/i.test(this.nodeName)&&(this.selectedIndex=
this.selectedIndex?this.selectedIndex-1:0)},down:function(){/select/i.test(this.nodeName)&&(a.changeOnBlur(this,"selectedIndex",this.selectedIndex),this.selectedIndex+=1)},shift:function(){return null},ctrl:function(){return null}}});f.extend(a.create,{keydown:{setup:function(c,d,e){-1!=f.inArray(d,a.key.kinds.special)&&(a.key[d+"Key"]=e)}},keypress:{setup:function(c,d,e){a.support.keyCharacters&&!a.support.keysOnNotFocused&&e.focus()}},keyup:{setup:function(c,d,e){-1!=f.inArray(d,a.key.kinds.special)&&
(a.key[d+"Key"]=null)}},key:{options:function(c,d,e){d="object"!=typeof d?{character:d}:d;d=f.extend({},d);d.character&&(f.extend(d,a.key.options(d.character,c)),delete d.character);return d=f.extend({ctrlKey:!!a.key.ctrlKey,altKey:!!a.key.altKey,shiftKey:!!a.key.shiftKey,metaKey:!!a.key.metaKey},d)},event:function(a,d,e){var g=f.getWindow(e).document||document;if(g.createEvent){var b;try{b=g.createEvent("KeyEvents"),b.initKeyEvent(a,!0,!0,l,d.ctrlKey,d.altKey,d.shiftKey,d.metaKey,d.keyCode,d.charCode)}catch(m){b=
f.createBasicStandardEvent(a,d,g)}b.synthetic=!0}else try{b=f.createEventObject.apply(this,arguments),f.extend(b,d)}catch(r){}return b}}});var g={enter:"\r",backspace:"\b",tab:"\t",space:" "};f.extend(a.init.prototype,{_key:function(c,d,e){if(/-up$/.test(c)&&-1!=f.inArray(c.replace("-up",""),a.key.kinds.special))a.trigger("keyup",c.replace("-up",""),d),e(!0,d);else{var k=f.getWindow(d).document.activeElement,b=a.typeable.test(d.nodeName)&&n(d),m=g[c]||c,r=a.trigger("keydown",m,d);c=a.key.getDefault;
var h=a.key.browser.prevent,p,l=a.key.options(m,"keypress");r?l?(k!==f.getWindow(d).document.activeElement&&(d=f.getWindow(d).document.activeElement),(r=a.trigger("keypress",l,d))&&(p=c(m).call(d,l,f.getWindow(d),m,void 0,b))):p=c(m).call(d,l,f.getWindow(d),m,void 0,b):l&&-1==f.inArray("keypress",h.keydown)&&(k!==f.getWindow(d).document.activeElement&&(d=f.getWindow(d).document.activeElement),a.trigger("keypress",l,d));p&&p.nodeName&&(d=p);null!==p?setTimeout(function(){a.trigger("keyup",a.key.options(m,
"keyup"),d);e(r,d)},1):e(r,d);return d}},_type:function(a,d,e){var f=a.match(/(\[[^\]]+\])|([^\[])/g),b=this,g=function(a,c){var p=f.shift();p?(c=c||d,1<p.length&&(p=p.substr(1,p.length-2)),b._key(p,c,g)):e(a,c)};g()}});a.config.support?a.helpers.extend(a.support,a.config.support):!function(){if(document.body){var c=document.createElement("div"),d,e,f,b;c.innerHTML="<form id='outer'><input name='checkbox' type='checkbox'/><input name='radio' type='radio' /><input type='submit' name='submitter'/><input type='input' name='inputter'/><input name='one'><input name='two'/><a href='#abc'></a><textarea>1\n2</textarea></form>";
document.documentElement.appendChild(c);d=c.firstChild;e=d.getElementsByTagName("a")[0];f=d.getElementsByTagName("textarea")[0];b=d.childNodes[3];d.onsubmit=function(b){b.preventDefault&&b.preventDefault();a.support.keypressSubmits=!0;return b.returnValue=!1};b.focus();a.trigger("keypress","\r",b);a.trigger("keypress","a",b);a.support.keyCharacters="a"==b.value;b.value="a";a.trigger("keypress","\b",b);a.support.backspaceWorks=""==b.value;b.onchange=function(){a.support.focusChanges=!0};b.focus();
a.trigger("keypress","a",b);d.childNodes[5].focus();a.trigger("keypress","b",b);a.support.keysOnNotFocused="ab"==b.value;a.bind(e,"click",function(b){b.preventDefault&&b.preventDefault();a.support.keypressOnAnchorClicks=!0;return b.returnValue=!1});a.trigger("keypress","\r",e);a.support.textareaCarriage=4==f.value.length;document.documentElement.removeChild(c);a.support.ready++}else setTimeout(arguments.callee,1)}();return a}(s,u),z=function(a){(function(){if(document.body){var b=document.createElement("div");
document.body.appendChild(b);a.helpers.extend(b.style,{width:"100px",height:"10000px",backgroundColor:"blue",position:"absolute",top:"10px",left:"0px",zIndex:19999});document.body.scrollTop=11;document.elementFromPoint&&(document.elementFromPoint(3,1)==b?a.support.elementFromClient=!0:a.support.elementFromPage=!0,document.body.removeChild(b),document.body.scrollTop=0)}else setTimeout(arguments.callee,1)})();var f=function(b,c){var d=b.clientX,e=b.clientY,f=a.helpers.getWindow(c);if(a.support.elementFromPage)var g=
a.helpers.scrollOffset(f),d=d+g.left,e=e+g.top;d=f.document.elementFromPoint?f.document.elementFromPoint(d,e):c;return d===f.document.documentElement&&(0>b.clientY||0>b.clientX)?c:d},l=function(b,c,d){var e=f(c,d);a.trigger(b,c,e||d);return e},q=function(b,c,d){var e=f(b,c);if(d!=e&&e&&d){var g=a.helpers.extend({},b);g.relatedTarget=e;a.trigger("mouseout",g,d);g.relatedTarget=d;a.trigger("mouseover",g,e)}a.trigger("mousemove",b,e||c);return e},g=function(b,c,d,e,g){var k=new Date,l=c.clientX-b.clientX,
n=c.clientY-b.clientY,s=a.helpers.getWindow(e),v=f(b,e),w=s.document.createElement("div"),t=0;move=function(){var f=new Date,u=a.helpers.scrollOffset(s),f=(0==t?0:f-k)/d,x={clientX:l*f+b.clientX,clientY:n*f+b.clientY};t++;1>f?(a.helpers.extend(w.style,{left:x.clientX+u.left+2+"px",top:x.clientY+u.top+2+"px"}),v=q(x,e,v),setTimeout(arguments.callee,15)):(v=q(c,e,v),s.document.body.removeChild(w),g())};a.helpers.extend(w.style,{height:"5px",width:"5px",backgroundColor:"red",position:"absolute",zIndex:19999,
fontSize:"1px"});s.document.body.appendChild(w);move()},c=function(a,c,d,e,f){l("mousedown",a,e);g(a,c,d,e,function(){l("mouseup",c,e);f()})},d=function(b){b=a.jquery()(b);var c=b.offset();return{pageX:c.left+b.outerWidth()/2,pageY:c.top+b.outerHeight()/2}},e=function(b,c,e){var f=/(\d+)[x ](\d+)/,g=/(\d+)X(\d+)/,k=/([+-]\d+)[xX ]([+-]\d+)/;"string"==typeof b&&k.test(b)&&e&&(e=d(e),b=b.match(k),b={pageX:e.pageX+parseInt(b[1]),pageY:e.pageY+parseInt(b[2])});"string"==typeof b&&f.test(b)&&(b=b.match(f),
b={pageX:parseInt(b[1]),pageY:parseInt(b[2])});"string"==typeof b&&g.test(b)&&(b=b.match(g),b={clientX:parseInt(b[1]),clientY:parseInt(b[2])});"string"==typeof b&&(b=a.jquery()(b,c.document)[0]);b.nodeName&&(b=d(b));b.pageX&&(c=a.helpers.scrollOffset(c),b={clientX:b.pageX-c.left,clientY:b.pageY-c.top});return b},k=function(b,c,d){if(0>b.clientY){var e=a.helpers.scrollOffset(d);a.helpers.scrollDimensions(d);var f=e.top+b.clientY-100,g=f-e.top;0<f||(f=0,g=-e.top);b.clientY-=g;c.clientY-=g;a.helpers.scrollOffset(d,
{top:f,left:e.left})}};a.helpers.extend(a.init.prototype,{_move:function(b,c,d){var f=a.helpers.getWindow(c),l=e(b.from||c,f,c),n=e(b.to||b,f,c);!1!==b.adjust&&k(l,n,f);g(l,n,b.duration||500,c,d)},_drag:function(b,d,f){var g=a.helpers.getWindow(d),l=e(b.from||d,g,d),n=e(b.to||b,g,d);!1!==b.adjust&&k(l,n,g);c(l,n,b.duration||500,d,f)}});return a}(s);(function(a){return l.Syn=a})(s,t,u,y,z)}(window);