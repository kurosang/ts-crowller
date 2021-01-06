"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var cnodeAnalyzer = /** @class */ (function () {
    function cnodeAnalyzer() {
    }
    cnodeAnalyzer.getInstance = function () {
        if (!cnodeAnalyzer.instance) {
            cnodeAnalyzer.instance = new cnodeAnalyzer();
        }
        return cnodeAnalyzer.instance;
    };
    cnodeAnalyzer.prototype.getJsonInfo = function (html) {
        var infos = [];
        var $ = cheerio_1.default.load(html);
        var items = $('#topic_list .cell');
        items.map(function (idx, elem) {
            var title = $(elem).find('.topic_title').text();
            var time = $(elem).find('.last_active_time').text();
            infos.push({ title: title, time: time });
        });
        return {
            time: new Date().getTime(),
            data: infos,
        };
    };
    // 生成JSON
    cnodeAnalyzer.prototype.generateJsonContent = function (result, filePath) {
        var fileContent = {};
        // 判断这个路径是否存在这个文件
        if (fs_1.default.existsSync(filePath) && fs_1.default.readFileSync(filePath, 'utf-8')) {
            fileContent = JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
        }
        fileContent[result.time] = result.data;
        return fileContent;
    };
    cnodeAnalyzer.prototype.analyze = function (html, filePath) {
        var result = this.getJsonInfo(html);
        var fileContent = this.generateJsonContent(result, filePath);
        return JSON.stringify(fileContent);
    };
    return cnodeAnalyzer;
}());
exports.default = cnodeAnalyzer;
