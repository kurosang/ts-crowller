import Koa from 'koa'
import router from './router'

const app = new Koa()

app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) // 可以配置也可以配置，建议配置

app.listen(3000, () => {
  console.log('server running at 3000')
})
