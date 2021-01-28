# ts-crowller

ts 实战爬虫小工具

思路：axios 获取请求，cheerio 整理数据，然后 node fs 模块写入文件进行存储。

搭建环境：

1. npm init -y

2. npm install typescript ts-node

3. tsc --init 创建 tsconfig.json

4. 安装 axios 用于请求

5. 安装 cheerio，它使用类似 jq 的语法来获取页面上的内容

要点记录：

Crowller 负责爬取，analyzer 负责分析。

analyzer 改为单例模式。

我们使用 ts-node 来方便开发，但是给别人用需要编译。

监听 ts 文件变化，重新打包`tsc -w`。

安装 nodemon。监听整个项目文件的变化。

安装 concurrently。并行执行命令。

---

2021.1.22

有个 bug

```
  "scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/index.js",
    "dev": "concurrently npm:dev:*"
  }
```

当我们第一次运行 npm run dev 的时候会报错，因为我的 dev 是 concurrently 并行运行上面两条命令，原理是 tsc 监听 ts 文件变化就重新编译，并且重新运行 index.js。

但由于第一次运行的时候可能 index.js 文件还没生成，所以报错。

```
  "scripts": {
    "dev:build": "tsc -w",
    "dev:start": "nodemon node ./build/index.js",
    "dev": "tsc && concurrently npm:dev:*"
  }
```

解决方法：执行并行命令前，先 tsc 编译一次

---

改造一：通过启动 koa，通过接口调用爬虫

---

问题 1: koa 库的类型定义文件 .d.ts 文件类型描述不准确

```
router.post('/getData', async (ctx) => {
  // ...这里的password是any类型
  ctx.request.body.password
})
```

原因是：Request 的 body 是 any 类型

```
declare module "koa" {
    interface Request {
        body?: any;
        rawBody: string;
    }
}
```

解决方法是重写 Request，继承

```
import { Request } from 'koa'
interface RequestWithBody extends Request {
  body: {
    [key: string]: string | undefined
  }
}

router.post('/getData', async (ctx) => {
  const { password } = (ctx.request as RequestWithBody).body
  if (password === '123') {
    const url = `https://cnodejs.org/?tab=good`
    const analyzer = cnodeAnalyzer.getInstance()
    new Crowller(url, analyzer)
    ctx.body = 'this is getData success'
  } else {
    ctx.body = 'password Error!'
  }
})
```

问题 2: 当使用中间件的时候，对 req 或者 res 做了修改之后呢，实际上类型并不能改变。

类型融合

创建一个`definition.d.ts`文件

```
import { Request } from 'koa'

declare module 'koa' {
  interface Request {
    name: string
  }
}

```

index.ts

```
import Koa, { Request } from 'koa'
import router from './router'
import bodyParser from 'koa-bodyparser'
const app = new Koa()

app.use(bodyParser())
// 自己写一个中间件，往request上挂东西
app.use((ctx, next) => {
  ;(ctx.request as Request).name = '123'
  next()
})
app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) // 可以配置也可以配置，建议配置

app.listen(3000, () => {
  console.log('server running at 3000')
})

```

这样我们就可以在很多地方都拿到 ctx.request.name 这个字段。相当于全局
