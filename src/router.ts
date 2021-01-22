import Router from 'koa-router'
import Crowller from './crowller'
import cnodeAnalyzer from './cnodeAnalyzer'
const router = new Router()

router.get('/', async (ctx) => {
  ctx.body = '首页'
})

router.get('/getData', async (ctx) => {
  const url = `https://cnodejs.org/?tab=good`
  const analyzer = cnodeAnalyzer.getInstance()
  new Crowller(url, analyzer)
  ctx.body = 'this is getData success'
})

export default router
