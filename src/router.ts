import { Next, Request, Context } from 'koa'
import fs from 'fs'
import path from 'path'
import Router from 'koa-router'

import Crowller from './utils/crowller'
import Analyzer from './utils/analyzer'
import { getResponseData } from './utils/util'
interface bodyRequest extends Request {
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (ctx: Context, next: Next) => {
  const isLogin = ctx.session ? ctx.session.login : undefined
  if (isLogin) {
    next()
  } else {
    ctx.body = getResponseData(null, '请先登录')
  }
}

const router = new Router()

router.get('/', async (ctx) => {
  const isLogin = ctx.session ? ctx.session.login : undefined
  if (isLogin) {
    ctx.body = `
    <html>
      <body>
        <a href="/showData">显示</a>
        <a href="/getData">爬取</a>
        <a href="/logout">退出</a>
      </body>
    </html>
    `
  } else {
    ctx.body = `
    <html>
      <body>
        <form method="post" action="/login">
          <input type="password" name="password"/>
          <button>提交</button>
        </form>
      </body>
    </html>`
  }
})

router.get('/logout', async (ctx) => {
  if (ctx.session) {
    ctx.session.login = undefined
  }
  ctx.body = getResponseData(true)
})

router.post('/login', async (ctx) => {
  const { password } = (ctx.request as bodyRequest).body
  const isLogin = ctx.session ? ctx.session.login : undefined

  if (isLogin) {
    ctx.body = getResponseData(false, '你已经登录过')
  } else {
    if (password === '123' && ctx.session) {
      ctx.session.login = true
      ctx.body = getResponseData(true, '登陆成功')
    } else {
      ctx.body = getResponseData(false, '登录失败')
    }
  }
})

router.get('/getData', checkLogin, async (ctx) => {
  const url = `https://cnodejs.org/?tab=good`
  const analyzer = Analyzer.getInstance()
  new Crowller(url, analyzer)
  ctx.body = getResponseData(true)
})

router.get('/showData', checkLogin, async (ctx) => {
  try {
    const postion = path.resolve(__dirname, '../data/articles.json')
    const result = fs.readFileSync(postion, 'utf-8')
    ctx.body = getResponseData(result)
  } catch (error) {
    ctx.body = getResponseData(false, '尚未爬取到内容')
  }
})

export default router
