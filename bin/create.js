// bin/create.js
const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./Generator')

module.exports = async function (name, options) {
  const target_air = path.join(process.cwd(), name);
  // 目录是否已经存在
  if (fs.existsSync(target_air)) {
    // 是否为强制创建
    if (options.force) {
      await fs.remove(target_air);
    } else {
      // 询问用户是否要覆盖
      let { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'Target directory already exists Pick an action',
        choices: [
          {
            name: 'Overwrite', value: 'overwrite'
          }, {
            name: 'Cancel', value: false
          }
        ]
      }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log('\r\nRemoving...');
        await fs.remove(target_air);
      }
    }
  } else {
    const generator = new Generator(name, target_air);
    generator.create();
  }
}