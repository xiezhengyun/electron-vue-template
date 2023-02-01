const path = require('path');
const FileSystem = require('fs');

const base = {
  "appId": "pacsclient",
  "directories": {
    "output": "dist"
  },
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "shortcutName": "pacsclient",
    "deleteAppDataOnUninstall": true,
    "include": "scripts/urlProtoco.nsh"
  },
  "win": {
    "target": "nsis"
  },
  "linux": {
    "target": ["snap"]
  },
  "publish": [{
    "provider": "generic",
    "url": process.env.APP_UPDATE_URL
  }],
  "files": [
    "build/main/**/*",
    {
      "from": "build/renderer",
      "to": "renderer",
      "filter": ["**/*"]
    },
    {
      "from": "src/main/static",
      "to": "static",
      "filter": ["**/*"]
    },
    "!**/node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme}",
    "!**/node_modules/*/{test,__tests__,tests,powered-test,example,examples}",
    "!**/node_modules/*.d.ts",
    "!**/node_modules/.bin",
    "!src",
    "!config",
    "!README.md",
    "!scripts",
    "!build/renderer",
    "!dist"
  ]
}

function getBase(base) {
  const baseData = {
    ...base
  }
  baseData.publish[0].url = process.env.APP_UPDATE_URL
  return baseData
}

function generateBuildJson() {
  console.log('generateBuildJson', process.env.APP_UPDATE_URL)
  const json = JSON.stringify(getBase(base), null, 4)
  const file = path.join(__dirname, 'electron-builder.json');
  FileSystem.writeFile(file, json, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log('文件创建成功，地址：' + file);
  });
}

module.exports = generateBuildJson