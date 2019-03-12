//防止变量污染，使用立即函数
(function(){

	function TurnPage(options){
		//保存变量
		this.wrap = options.wrap;//插入的标签里
		this.curPage = options.curPage;
		this.allPage = options.allPage;
		this.changePage = options.changePage;
		this.fillHtml();//调用翻页结构的方法
		this.bindEvent();//添加绑定事件
	}
	//原型链上编程节省空间
	TurnPage.prototype.fillHtml = function(){
		$(this.wrap).empty();//清空
		//添加上一页
		if(this.curPage > 1){//当前页数大于1的时候 动态插入元素标签
			$(this.wrap).append('<li class="prev-page">上一页</li>');
		}else{
			$(this.wrap).remove('.prev-page');
		}

		
		//添加第1页 当前页数-2是否大于1
		if(this.curPage - 2 > 1){
			$(this.wrap).append('<li class="tabNumber">1</li>');
		}

		//添加...
		if(this.curPage - 2 > 2){
			$(this.wrap).append($('<span>...</span>'));
		}
		
		//循环渲染中间的五页
		for(var i = this.curPage - 2; i <= this.curPage + 2; i ++){
			if( i > 0 && i <= this.allPage ){
				if(i === this.curPage){
					$(this.wrap).append('<li class="tabNumber curPage">' + i + '</li>');
				}else{
					$(this.wrap).append('<li class="tabNumber">' + i + '</li>');
				}
			}
		}

		//添加...
		if(this.curPage + 2 < this.allPage - 1){
			$(this.wrap).append($('<span>...</span>'));
		}

		//添加最后一页  当前页+2小于最后一页的时候出现
		if(this.curPage + 2 < this.allPage){
			$(this.wrap).append('<li class="tabNumber">' + this.allPage + '</li>');
		}
		//添加下一页
		if(this.curPage < this.allPage){
			$(this.wrap).append('<li class="next-page">下一页</li>');
		}else{
			$(this.wrap).remove('.next-page');
		}
	}

	//添加事件
	TurnPage.prototype.bindEvent = function(){
		var self = this;
		//点击上一页
		$('.prev-page', this.wrap).click(function(){
			if(self.curPage > 1){
				self.curPage --;
				self.change();
			}
		});
		//点击下一页
		$('.next-page', this.wrap).click(function(){
			if(self.curPage < self.allPage){
				self.curPage ++;
				self.change();
			}
		});
		//点击当前页
		$('.tabNumber', this.wrap).click(function(){
			self.curPage = parseInt( $(this).text() );//由字符型转化成number整型
			self.change();
		})
		
	}

	TurnPage.prototype.change = function(){
		this.fillHtml();//重新渲染页码
		this.bindEvent();//重新调用点击事件
		this.changePage(this.curPage);//改变页码的时候执行changePage函数
	}
	//jQuery扩展插件，将有dom元素调用这个方法
	$.fn.extend({
		//组件turnPage  options参数，页码信息
		turnPage: function(options){
			options.wrap = this;//插入到调用这个方法的dom元素里
			new TurnPage(options);//执行
			return this;//方便链式调用
		}
	})

})()