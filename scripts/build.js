const Path = require('path');
const Chalk = require('chalk');
const FileSystem = require('fs');
const Vite = require('vite');
const rm = require('rimraf');
const compileTs = require('./private/tsc');
const {
    getEnvironmentVariables,
    setEnvironmentVariables
} = require('./base')
const generateBuildJson = require('../electron-builder-base')

// 环境变量
const fieldObj = getEnvironmentVariables()

// 生成配置json
generateBuildJson()

function buildRenderer() {
    return Vite.build({
        configFile: Path.join(__dirname, '..', 'vite.config.js'),
        base: './',
        mode: 'production'
    });
}

function buildMain() {
    console.log(process.env.NODE_ENV)
    const mainPath = Path.join(__dirname, '..', 'src', 'main');
    return compileTs(mainPath);
}

FileSystem.rmSync(Path.join(__dirname, '..', 'build'), {
    recursive: true,
    force: true,
})

console.log(Chalk.blueBright('Transpiling renderer & main...'));

rm.sync('./build')
rm.sync('./dist')

Promise.allSettled([
    buildRenderer(),
    buildMain(),
]).then(() => {
    setEnvironmentVariables(fieldObj)
    console.log(Chalk.greenBright('Renderer & main successfully transpiled! (ready to be built with electron-builder)'));

});