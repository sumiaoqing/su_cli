#! /usr/bin/env node
const { program } = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

// 定义命令和参数
program.command('create <app-name>')
  .description('create a new project')
  // -f 强制覆盖
  .option('-f,--force', 'overwrite target directory if it exists')
  .action((name, options) => {
    require("../bin/create")(name, options);
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]')

program.on('--help', () => {
  // 使用fight绘制logo
  console.log('\r\n' + figlet.textSync('su', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true
  }));
  console.log(`\r\nRun ${chalk.cyan(`roc <command> --help`)}show details\r\n`);
})

// 解析用户传入参数
program.parse(process.argv);