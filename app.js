const fs = require('fs');
const path = require('path');
const express = require('express');
const util = require('./util');
const base64 = util.base64;
const readSync = util.readSync;
const writeSync = util.writeSync;

const BUILD_DIR = 'dist'; // 构建目录
const ENTRY_FILE = './node.txt'; // SS(R)入口

// 文件处理逻辑封装成函数
function processFile() {
    let str = readSync(ENTRY_FILE);
    let checker = item => item.includes('ssr://') || item.includes('ss://');
    let result = str.split('\n\n')
                   .filter(checker)
                   .map(base64)
                   .join('\r\n');
    writeSync(path.resolve(__dirname, BUILD_DIR, 'index.html'), result);
}

// 初次执行文件处理
processFile();

// 监听文件变化
fs.watch(path.resolve(__dirname, ENTRY_FILE), (eventType, filename) => {
    if (filename && eventType === 'change') {
        console.log(`File ${filename} has been changed, reprocessing...`);
        processFile();
    }
});

// 设置 Express 服务器
const app = express();
app.use(express.static(BUILD_DIR));
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
