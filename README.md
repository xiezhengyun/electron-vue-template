<div align="center"> 
  
![image](https://user-images.githubusercontent.com/32544586/163651496-2589c0b0-4151-4941-9d90-4275eea5fd83.png)

A simple starter template for a **Vue3** + **Electron** TypeScript based application, including **ViteJS** and **Electron Builder**.
</div>

## About
这个模板利用 ViteJS 来构建和服务您的(Vue 驱动的)前端流程，它提供了 Hot Reloads (HMR)来使开发更快和更容易

构建 Electronic (主)流程是使用 ElectronBuilder 完成的，这使您的应用程序易于发布，并支持跨平台编译

### Install dependencies ⏬

```bash
yarn install
```

### Start developing ⚒️

```bash
yarn dev
```

Optional configuration options can be found in the [Electron Builder CLI docs](https://www.electron.build/cli.html).
## Project Structure

```bash
- scripts/ # all the scripts used to build or serve your application, change as you like.
- src/
  - main/ # Main thread (Electron application source)
  - renderer/ # Renderer thread (VueJS application source)
```

## Using static files

If you have any files that you want to copy over to the app directory after installation, you will need to add those files in your `src/main/static` directory.

如果您有任何要在安装后要复制到应用程序目录的文件，则需要在`src/main/static`目录中添加这些文件。

从主过程中引用静态文件

#### Referencing static files from your main process

```ts
/* Assumes src/main/static/myFile.txt exists */

import {app} from 'electron';
import {join} from 'path';
import {readFileSync} from 'fs';

const path = join(app.getAppPath(), 'static', 'myFile.txt');
const buffer = readFileSync(path);
```

## 主要功能

- 渲染进程和主通信。
  - 看'change-win2'，主进程主动向渲染进程发消息
  - window.ipcRenderer.send ，渲染进程向主进程发消息
  - 中间可通过 event.sender.send 反复通信。

- 窗口位置调整

- 开机自启动

- URL Scheme 打开，url传递信息，类似：pacsclient://openApp?a=1&b=1212441q

- 本地 node serve 服务，可接收其他本地服务调用
  - http://localhost:7898/ask 传消息给渲染进程
  - http://localhost:7898/show 唤起窗口

- 应用启动检测版本更新。具体做法：
   1. 需要一个服务器，放latest.yml和exe文件
   2. 在checkUpdate.ts 和 electron-builder 的publish 里 填写服务器地址
   3. 每次发布后，把 1 里的文件放入服务器，应用启动检测到新版本，就可以弹窗提示下载更新
   4. 点击确认，下载更新安装新版本 
   5. https://github.com/xiezhengyun/electron-vue-template/electron-pacs-serve 这个是本地服务例子，拉项目后，安装依赖，运行命令：node index

- env.dev, env.prod, env.prod 文件，区分环境，文件里有各个环节不同变量。比如：APP_UPDATE_URL 包更新地址
  文件里设置的变量，会被设置到 process.env 上面。 例：process.env.APP_UPDATE_URL

- 环境区分，dev，test，prod。
 - yarn dev 本地运行dev
 - yarn dev: prod 代表本地运行正式环境
 - yarn build:test windows 打包，测试环境
 - yarn build:prod windows 打包，正式环境
