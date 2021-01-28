console.log('hello world!!2')
// ts -> .d.ts 翻译文件 @types/superagent -> js
import axios from 'axios'

import fs from 'fs'
import path from 'path'

export interface Analyzer {
  analyze: (html: string, filePath: string) => string
}

class Crowller {
  // cnode 社区
  private filePath = path.join(__dirname, '../../data/articles.json')

  private async getRawHtml() {
    const res = await axios.get(this.url)

    return res.data
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content)
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml()
    const fileContent = this.analyzer.analyze(html, this.filePath)

    this.writeFile(fileContent)
  }

  constructor(private url: string, private analyzer: Analyzer) {
    console.log('constructor')
    this.initSpiderProcess()
  }
}

export default Crowller
