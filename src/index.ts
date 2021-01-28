import Koa, { Request } from 'koa'
import router from './router'
import KoaSession from 'koa-session'
import bodyParser from 'koa-bodyparser'
const app = new Koa()

app.use(bodyParser())
// // 自己写一个中间件，往request上挂东西
// app.use((ctx, next) => {
//   ;(ctx.request as Request).name = '123'
//   next()
// })
app.keys = ['some secret hurr']
const CONFIG = {
  key: 'koa:sess', //cookie key (default is koa:sess)
  maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, //签名默认true
  rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, //(boolean) renew session when session is nearly expired,
}
app.use(KoaSession(CONFIG, app))
app.use(router.routes()) // 启动路由
app.use(router.allowedMethods()) // 可以配置也可以配置，建议配置

app.listen(3000, () => {
  console.log('server running at 3000')
})
