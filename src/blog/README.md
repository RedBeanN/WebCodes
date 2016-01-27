# Blog App

## by HSN

### 2016/1/27

#### ver 1.0
1. 功能实现
  1. 用户注册、登入、登出
  >  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/30328110.jpg">
  >  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/84298857.jpg">
  >  
  >  注册和登录失败提示
  >>  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/39553063.jpg">
  >>  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/96313133.jpg">
  >  
  >  加载中动画和跳转提醒
  >>  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/36943711.jpg" style="height: 120px">
  >>  <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/65846614.jpg" style="height: 120px">

  2. 博客评论和评论回复
  > <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/28464570.jpg" style="width: 680px">
  
  3. 权限管理
  > 游客/普通用户：查看文章、评论、回复评论，用户可以删除自己的评论和回复
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/23099676.jpg" style="width: 680px">
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/87814450.jpg" style="width: 680px">
	>
  > 文章作者：修改或删除自己的文章
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/86084323.jpg" style="width: 680px">
  >
  > 管理员：隐藏普通用户文章、评论和评论回复，修改和删除游客文章、游客评论、游客回复
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/66161425.jpg" style="width: 680px">
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/98569202.jpg" style="width: 680px">
   
  4. UI优化
  > 风格化：整体采用扁平化风格
  >
  > 文章预览可以关闭
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/10110560.jpg" style="width: 680px">
  > 
  > 加载中界面
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/75848432.jpg" style="width: 680px">

2. 额外功能
  1. 分页功能（作为模块`am.paging`保存在`paging.js`以便复用）
  > 文章总数>5时底部显示分页栏
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/7865531.jpg" style="width: 680px">
  >
  > 不可跳转的按钮显示灰色
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/67217690.jpg" style="width: 400px">
  >
  > 可以手动输入每页显示的条数
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/41249076.jpg" style="width: 400px">
  >
  > 页数过多时显示当前页附近和首末页
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/8945403.jpg" style="width: 400px">

  2. 搜索功能
  > <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/27059822.jpg" style="width: 680px">
  
  3. Markdown语法编辑器
  > 内置Markdown语法编辑器用于保存文章
	>
  > 添加、修改文章界面带有Markdown预览
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/1578459.jpg" style="width: 680px">
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/66451538.jpg" style="width: 680px">
	>
  > 查看全文时使用Markdown渲染后显示
  >> <img src="http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/36017281.jpg" style="width: 680px">

3. 一些说明
  1. 第一次运行时会自动生成管理员账户`administrator`
  > ![](http://7xqirt.com1.z0.glb.clouddn.com/16-1-27/78784299.jpg)

  2. 除`administrator`账户外新的管理员账户需要手动在数据库提升权限，命令为
  > `mongo`
  > 
  > `use data`
  >
  > `db.usermodels.update({username:`%username`}, {$set:{root: "administrator"}})`