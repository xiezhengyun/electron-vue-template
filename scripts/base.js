const FileSystem = require('fs');
const dotenv = require('dotenv')
const Path = require('path');

function getEnvironmentVariables() {
  let fieldObj = {}
  // 设置环境变量
  const envConfig = dotenv.parse(FileSystem.readFileSync(`.env.${process.env.NODE_ENV}`))
  for (const k in envConfig) {
    process.env[k] = envConfig[k]
    fieldObj[k] = envConfig[k]
  }
  return fieldObj
}

function setEnvironmentVariables(fieldObj) {
  const path = Path.join(__dirname, '../', 'build/main/utils/.env')
  let content = ''
  for (const key in fieldObj) {
    if (Object.hasOwnProperty.call(fieldObj, key)) {
      content += `${key}='${fieldObj[key]}'` + '\n'
    }
  }
  FileSystem.writeFileSync(path, content, 'utf8')
}

module.exports = {
  getEnvironmentVariables,
  setEnvironmentVariables
}