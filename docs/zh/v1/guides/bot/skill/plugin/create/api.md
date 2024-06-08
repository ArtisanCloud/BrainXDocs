---
title: api服务对接
date: 2024-06-04
---

# 对接现有的API服务到BrainX作为插件使用

## 步骤一：创建插件

1. 登录BrainX：
打开BrainX平台，并登录你的账户。
2. 选择团队：
在左侧导航栏的 My Workspace 区域，选择进入你希望在其中创建插件的指定团队。
3. 进入Plugins页面：
在页面顶部导航栏找到并进入Plugins页面，或者在Bot编排页面中找到Plugins区域，并单击“+”来添加插件。
4. 创建插件：
单击“Create plugin”按钮开始创建插件。
5. 配置插件：

在Create Plugin对话框中，完成以下配置项并单击“Confirm”保存设置。

| 配置项				           | 说明																		                                               |  
|-------------------|--------------------------------------------------------------------|  
| 插件图标				          | 单击默认图标后，上传本地图片文件作为新的图标。									                                   |  
| 插件名称			           | 自定义插件名称，用于标识当前插件。自定义插件名称，用于标识当前插件。建议输入可识别的名称，Bot会根据插件名称来判断是否使用该插件。 |  
| 插件描述	             | 插件的描述信息，记录当前插件的用途。												                                     |  
| 插件创建方式            | 选择“Register for existing services”。										                      |  
| API URL				       | 插件的访问地址或相关资源的链接，例如：https://www.example.com/api。					               |  
| Header列表			       | 根据API的HTTP请求头参数要求填写。												                                   |  
| Authorization 方法	 | 选择插件内API的鉴权方式（No authorization、Service、Oauth > standard）。			       |

* Service鉴权方式：
  * Location：选择秘钥或令牌的传递位置（Header或Query）。
  * Parameter name：秘钥或令牌对应的参数名称。
  * Service token / API key：秘钥或令牌的值。
* Oauth > standard鉴权方式：
  * client_id：OAuth注册后获取的唯一标识符。
  * client_secret：与client_id匹配的密码。
  * client_url：验证通过后，模型会重定向到该URL。
  * scope：应用需要访问的资源范围或级别。
  * authorization_url：OAuth提供商的URL，用户会重定向到该URL进行应用授权。
  * authorization_content_type：向OAuth提供商发送数据时的内容类型。

## 步骤二：创建并调试工具

1. 创建工具：
在已创建的Plugins页面，找到你刚创建的插件，并单击“Create tool”开始创建工具。
2. 配置基本信息：

在Basic information界面，完成以下配置项并单击“Save and continue”。
| 配置项			| 说明																		|  
| :--: | :--: |  
| Tool name			| 工具名称，用于标识当前工具。													|  
| Tool description	| 工具的描述信息，记录当前工具的用途。												|  
| Tool path			| 工具对应的完整API请求路径。前半段默认为插件的API URL。（例如：`/api/v1/tools/{tool_name}`）|



路径填写说明：
如果API没有具体的路径，只有域名，则可以在Tool path内填写“/”作为路径。
如果需要在API的请求路径内插入变量，可以使用大括号“{}”包裹变量名作为占位符，并在后续添加输入参数时对应设置。

配置请求方式：
在Input parameters界面，选择API的请求方式（如GET、POST等），并根据需要添加输入参数。

| 配置项			| 说明																																					|  
| :--: | :--: |  
| Tool name			| 工具名称，用于标识当前工具。																															|  
| Tool description	| 工具的描述信息，记录当前工具的用途。																													|  
| Tool path			| 工具对应的完整API请求路径。前半段默认为插件的API URL。（例如：`/api/v1/tools/{tool_name}`）																|  
| Request Method	| API的请求方式，选择正确的请求方式。常见的请求方式包括GET、POST、PUT、DELETE等。																			|  
| Input parameters	| 根据API的要求添加输入参数，包括参数名称、类型、位置等。这些参数将用于构建API请求。例如：`{"param1": "value1", "param2": "value2"}` 或 `param1=value1&param2=value2` |

保存并继续：
完成输入参数的配置后，单击“Save and continue”保存设置，并根据需要进行后续的调试和发布操作。
通过以上步骤，你可以将现有的API服务导入到BrainX平台中，作为插件使用，并为其添加相应的工具以完成相应的功能。


## 步骤三：发布插件
