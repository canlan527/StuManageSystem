var tableData = [];
var pageSize = 4;//每页展示10条数据
var curPage = 1;//默认当前页第1页
function bindEvent(){
	//左侧菜单
	$('#menu').on('click','dd',function(e){
		$('#menu > dd').removeClass('active');
		$(this).addClass('active');
		//右侧内容出现
		var id = $(this).attr('data-id');
		if(id == 'stuList'){
			getTableData();//获取表格列表
		}

		$('.content').fadeOut();
		$('.' + id).fadeIn();
		
	})
	$('#addSubmit').click(function(e){
		e.preventDefault();//阻止默认事件
		var data = getFormMes($('.addMesForm'));//执行表单提交后获取数据
		transferData('api/student/addStudent',data,function(res){
			// console.log(res);
			if(res.status == 'success'){
				alert('添加成功');
				$('.addMesForm')[0].reset();
				$('#menu > dd[data-id=stuList]').trigger('click');
			}
		});
	});

	//编辑model的提交
	$('#editSubmit').click(function(e){
		e.preventDefault();
		// console.log(e.target);
		// alert(1);
		var data = getFormMes($('.editMesForm'));
		// console.log(data);
		transferData('/api/student/updateStudent',data, function(res){
			// console.log(res);
			if(res.status == 'success'){
				alert('修改成功');
				$('.editMesForm')[0].reset();
				$('.model').slideUp();
				$('#menu > dd[data-id=stuList]').trigger('click');
			}
		});
	});
	//搜索功能
	$('#searchBtn').click(function(e){
		var value = $('#searchWord').val();//获取输入框内容
		if(value){
			curPage = 1;
			getFilterData(value);//调用筛选方法
		}else{
			getTableData();
		}
	});
}

//获取表单信息
function getFormMes(dom){
	var data = $(dom).serializeArray();//获取表单信息
	//将信息从对象里遍历出来
	var result = {};
	data.forEach(function(item, index){
		result[item.name] = item.value;//将输入框的值取出
	});
	return result;	
}

//筛选符合条件的信息
function getFilterData(value){
	transferData('/api/student/searchStudent',{
		sex: -1,
		search: value,
		page: curPage,
		size: pageSize
	},function(res){
		if(res.status == 'success'){
			tableData = res.data.searchList;
			//添加翻页插件
			var allPage = Math.ceil(res.data.cont / pageSize);
			$('#turnPage').turnPage({
				curPage : curPage,	
				allPage,
				changePage: (page) => {
					curPage = page;
					getFilterData(value);//重新渲染搜索后的列表
				}
			})
			renderTable(res.data.searchList);
		}
	})
}
//列表里的事件
function bindTableEvent(){
	$('.edit').on('click',function(e){
		//表单回填
		var index = $(this).attr('data-index');
		// console.log(index);
		//model的滑下
		$('.model').slideDown();
		renderEditForm(tableData[index]);//表单回填
		// console.log(tableData[index]);
	});	

	$('.mask').click(function(){
		$('.model').slideUp();
	});	
	//删除
	$('.del').click(function(){
		var index = $(this).data('index');//获取列表的下标
		console.log(index);
		var isDel = window.confirm('确认删除？');//返回true、false
		if(isDel){
			transferData('/api/student/delBySno',{
				sNo: tableData[index].sNo
			},function(res){
				if(res.status == 'success'){
					alert('删除成功');
					$('#menu > dd[data-id=stuList]').trigger('click');
				}
			});
		}
	});
}


//获取表格数据
function getTableData(){
	transferData('/api/student/findByPage',{
		page: curPage,
		size: pageSize
	},function(res){
		console.log(res);
		if(res.status == 'success'){
			// console.log(res)
			tableData = res.data.findByPage;
			//添加翻页插件
			var allPage = Math.ceil(res.data.cont / pageSize);
			$('#turnPage').turnPage({
				curPage : curPage,	
				allPage,
				changePage: (page) => {
					curPage = page;
					getTableData();//重新渲染列表
				}
			})
			renderTable(res.data.findByPage);
		}
	});
}


//编辑的表单回填
function renderEditForm(data){
	// console.log(data);
	var editForm = $('.editMesForm')[0];//获取表单
	//遍历
	for(var prop in data){
		// console.log(editForm[prop]);
		if(editForm[prop]){
			editForm[prop].value = data[prop];
		}
	}

}


//渲染表格
function renderTable(data){
	var str = '';
	data.forEach(function(item, index){
		str += '<tr>\
			<td>' + item.sNo + '</td>\
			<td>' + item.name +'</td>\
			<td>' + (item.sex ? '女' : '男') +'</td>\
			<td>' + item.email + '</td>\
			<td>' + (new Date().getFullYear() -item.birth ) + '</td>\
			<td>' + item.phone + '</td>\
			<td>' + item.address + '</td>\
			<td>\
				<button class="btn2 edit" data-index='+ index +'>编辑</button>\
				<button class="btn2 del" data-index='+ index +'>删除</button>\
			</td>\
		</tr>';
	});
	$('#mes').html(str);
	bindTableEvent();
}

//ajax公共部分
function transferData(url,data, cb){
	$.ajax({
		url: 'http://api.duyiedu.com/' + url,
		type: 'get',
		data: {
			appkey: 'dongmeiqi_1547441744650',
			...data	//将data与appkey相连，对象的扩展
		},
		dataType: 'json',
		success: function(res){
			cb(res);
		}
	});
}
function init(){
	bindEvent();
	$('#menu > dd[data-id=stuList]').trigger('click');
}
init();

