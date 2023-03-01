# Kivicube Slam交互模板

## 源码目录


#### 1、[云识别 - 平面AR](../../tree/main/pages/cloudar-plane/)，云识别后再识别平面以放置模型。

#### 2、[云识别 - 漫游AR](../../tree/main/pages/cloudar-vio/)，云识别后使用漫游AR快速放置模型。


## 快速体验

1. 克隆或下载此仓库至本地。
2. 使用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html)导入本项目，并将appid修改为自己的appid。
3. 打开app.js文件，替换为我们给予你的license，用来去除水印。
4. 服务器域名配置。有两种方案，一是直接在手机上打开小程序的“开发调试”模式，参考[vConsole](https://developers.weixin.qq.com/miniprogram/dev/framework/usability/vConsole.html)；二是在小程序后台，将域名“ https://meta.kivisense.com ”配置到request和downloadFile两项中，参考[微信官方文档 - 网络](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)。推荐第二种。
5. 之后，可在微信开发者工具上，点击“预览”按钮，用微信扫描打开体验。【Slam功能不支持在开发者工具上运行，也不支持真机调试。】