module.exports=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n.w={},n(n.s=3)}([function(e,t){e.exports=require("child_process")},function(e,t){e.exports=require("process")},function(e,t){e.exports=require("babel-polyfill")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.GulpDockerCompose=void 0;var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(2);var o=s(n(1)),i=s(n(0));function s(e){return e&&e.__esModule?e:{default:e}}function u(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var a=t.GulpDockerCompose=function(){function e(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),!t)throw new Error("Gulp instance not provided");this._gulp=t,this._options=n||{};var r=this.getServiceName();if(!this.isStringNotEmpty(r))throw new Error("No service name provided");this.makeTasks(),this.handOnInt()}return r(e,[{key:"makeTasks",value:function(){var e=this.getTasks();if(e){var t="",n=void 0;if(e.run&&(n=e.run,t=this.isStringNotEmpty(n.name)?n.name:"docker-compose:run:#SERVICE_NAME#",this.makeMainTask(n.dependences,t)),e.restart&&(n=e.restart,t=this.isStringNotEmpty(n.name)?n.name:"docker-compose:restart:#SERVICE_NAME#",this.makeMainTask(n.dependences,t)),e.watchYML){n=e.watchYML,t=this.isStringNotEmpty(n.name)?n.name:"docker-compose:watch-yml";var r=this.isStringNotEmpty(n.nameRestart)?n.nameRestart:"docker-compose:restart-all";this.makeWatchYMLTask(t,r)}}}},{key:"makeMainTask",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"docker-compose:run:#SERVICE_NAME#";n=n.replace("#SERVICE_NAME#",this.getServiceName());var r=this.getExtraArgs().upOnRun||"";this.getGulp().task(n,t,function(){return e.exec("docker-compose up -d --build "+r).then(function(t){e.printOutput.apply(e,u(t))}).catch(function(e){console.error(e.message)})})}},{key:"makeWatchYMLTask",value:function(e,t){var n=this,r=this.getExtraArgs().upOnYMLChange||"",o=this.getOptions().projectFolder||"./",i=this.getGulp();i.task(t,function(){return n.exec("docker-compose up -d --remove-orphans "+r).then(function(e){n.printOutput.apply(n,u(e))}).catch(function(e){console.error(e.message)})}),this.getGulp().task(e,function(){i.watch([o+"/docker-compose.yml"],[t])})}},{key:"exec",value:function(){var e,t=(e=regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.getOptions().exposeCLICommands&&console.log("> "+t),e.abrupt("return",new Promise(function(e,n){i.default.exec(t,{windowsHide:!0},function(t,r,o){t?n(t):e([r,o])})}));case 2:case"end":return e.stop()}},e,this)}),function(){var t=e.apply(this,arguments);return new Promise(function(e,n){return function r(o,i){try{var s=t[o](i),u=s.value}catch(e){return void n(e)}if(!s.done)return Promise.resolve(u).then(function(e){r("next",e)},function(e){r("throw",e)});e(u)}("next")})});return function(e){return t.apply(this,arguments)}}()},{key:"handOnInt",value:function(){var e=this;!1!==this.getOptions().hangOnInt&&o.default.on("SIGINT",function(){e.stopDockerCompose().then(function(){o.default.exit(0)})})}},{key:"stopDockerCompose",value:function(){var e=this,t=this.getExtraArgs().stopAll||"";return this.exec("docker-compose stop "+t).then(function(t){e.printOutput.apply(e,u(t))}).catch(function(e){console.error(e.message)})}},{key:"printOutput",value:function(e,t){e&&!0===this.getOptions().exposeStdOut&&console.log(e.toString()),t&&!1!==this.getOptions().exposeStdErr&&console.log(t.toString())}},{key:"getGulp",value:function(){return this._gulp}},{key:"getServiceName",value:function(){return this.getOptions().serviceName||""}},{key:"getExtraArgs",value:function(){return this.getOptions().extraArgs||{}}},{key:"getOptions",value:function(){return this._options||{}}},{key:"getTasks",value:function(){return this.getOptions().tasks||{}}},{key:"isStringNotEmpty",value:function(e){return"string"==typeof e&&e.length>0}}]),e}();t.default=a}]);