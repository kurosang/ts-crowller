import cheerio from 'cheerio'
import fs from 'fs'
import path from 'path'
import { Analyzer } from './crowller'

interface article {
  title: string
  time: string
}

interface articleResult {
  time: number
  data: article[]
}

interface Content {
  [propName: number]: article[]
}

class cnodeAnalyzer implements Analyzer {
  private static instance: cnodeAnalyzer

  static getInstance() {
    if (!cnodeAnalyzer.instance) {
      cnodeAnalyzer.instance = new cnodeAnalyzer()
    }
    return cnodeAnalyzer.instance
  }

  private getJsonInfo(html: string) {
    const infos: article[] = []

    const $ = cheerio.load(html)
    const items = $('#topic_list .cell')

    items.map((idx, elem) => {
      const title = $(elem).find('.topic_title').text()
      const time = $(elem).find('.last_active_time').text()
      infos.push({ title, time })
    })

    return {
      time: new Date().getTime(),
      data: infos,
    }
  }

  // 生成JSON
  private generateJsonContent(result: articleResult, filePath: string) {
    let fileContent: Content = {}

    // 判断这个路径是否存在这个文件
    if (fs.existsSync(filePath) && fs.readFileSync(filePath, 'utf-8')) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    }

    fileContent[result.time] = result.data
    return fileContent
  }

  public analyze(html: string, filePath: string) {
    const result = this.getJsonInfo(html)

    const fileContent = this.generateJsonContent(result, filePath)

    return JSON.stringify(fileContent)
  }

  private constructor() {}
}

export default cnodeAnalyzer
