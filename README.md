# TODO-LIST

This is a project with bootstrap, jquery.

Github：<https://github.com/duicikeyihangaolou/todolist-bootstrap-jquery>

同步到 Gitee：<https://gitee.com/wu-wen-xiang/todolist-bootstrap-jquery>

后端服务 fastapi todolist demo，[Github](https://github.com/duicikeyihangaolou/fastapi-todo-list-demo)，[Gitee](https://gitee.com/wu-wen-xiang/fastapi-todo-list-demo)

## 从头搭建带有 bootstrap, jquery 的前端界面

本项目使用 vscode 开发。

### 代码编写 - 创建 index.html 文件

#### 快速生成 html 文件

在界面内敲入 html，等待时会给出提示，选择 “html:5”，则自动生成内容。

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
```

#### 使用 cdn 载入 bootstrap, jquery

参考 https://www.bootcdn.cn/ 网站，查找到想要版本的 bootstrap(4.6.2), jquery(3.7.1)，复制对应的标签，并添加到 index.html 的 header 中。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Todo-List</title>
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.2/css/bootstrap.css"
      rel="stylesheet"
    />
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.6.2/js/bootstrap.bundle.min.js"></script>
  </head>
  <body>
  </body>
</html>
```

#### 基于需求使用 bootstrap 编写 index.html

主要参考：

+ 布局：<https://getbootstrap.com/docs/4.6/layout/grid/>
+ 列表：<https://getbootstrap.com/docs/4.6/content/tables/>
+ 表单：<https://getbootstrap.com/docs/4.6/components/forms/>
+ 按钮：<https://getbootstrap.com/docs/4.6/components/buttons/>

基于上述参考编写页面内容。

### 代码编写 - 创建 script.js 文件

JQuery 参考：

- <https://jquery.com/>
- <https://www.w3schools.com/jquery/jquery_syntax.asp>

界面内容的操作使用 jquery 控制，将代码编写到 script.js 中，并将其载入到 index.html header 中。

```html
<script defer src="script.js"></script>
```

### 代码编写 - 创建 style.css 文件

一些细节样式，bootstrap 组件覆盖不到的部分，如颜色等可编写到 style.css 中，并将其载入到 index.html header 中。

```html
<link rel="stylesheet" href="style.css" />
```

### 查看运行

提前装好 Remote Explorer 插件（Vscode 插件），在 index.html 文件中右键选择 Open with live server，即可查看界面的运行结果。

### 使用 nginx

因 Demo 里面使用了后端 api 来获取任务数据，会产生跨域问题，所以在开发后期，使用 nginx 代理的方式访问页面。

参考：<https://nginxtutorials.com/install-nginx-on-mac/>

```bash
brew install nginx
```

输出：

```
Docroot is: /usr/local/var/www

The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /usr/local/etc/nginx/servers/.

To start nginx now and restart at login:
  brew services start nginx
Or, if you don't want/need a background service you can just run:
  /usr/local/opt/nginx/bin/nginx -g daemon\ off\;
```

修改配置文件：

```diff
$ diff nginx.conf nginx.conf.bak
57,60d56
<         location ~ /api/ {
<             proxy_pass   http://127.0.0.1:8000;
<         }
<
```

Nginx 启动和暂停

```bash
sudo nginx -t
sudo nginx
sudo nginx -s stop
sudo nginx -s reload
```
