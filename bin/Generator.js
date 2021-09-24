// lib/Generator.js
const inquirer = require('inquirer');
const { getRepoList, getTagList } = require('./http')
const path = require('path');
const ora = require('ora')
const util = require('util')
const downloadGitRepo = require('download-git-repo');
const chalk=require('chalk')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  const spinner = ora(message);
  spinner.start();

  try {
    // 执行传入方法
    const result = await fn(...args);
    spinner.succeed();
    return result
  } catch (err) {
    spinner.fail('Request failed,refetch ...')
  }
}

async function getRepo() {
  const repoList = await wrapLoading(getRepoList, 'waiting fetch template');
  if (!repoList) return
  // 返回模版名称列表
  const repos = repoList.data.map(item => item.name);
  const { repo } = await inquirer.prompt({
    name: 'repo',
    type: 'list',
    choices: repos,
    message: 'Please choose a template to create project'
  })
  return repo
}

async function getTag(repo) {
  const tagList = await wrapLoading(getTagList, 'waiting fetch tag', repo);
  if (!tagList) return
  // 返回版本名称列表
  const tags = tagList.data.map(item => item.name);
  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    choices: tags,
    message: 'Please choose a template to create project'
  })
  return tag
}

// 下载原程模版
// 1)拼接下载地址
// 2)调用下载
async function downTemplate(repo, tag, target_dir) {
  const request_url = `sumiaoqing/${repo}/${tag ? '#' + tag : ''}`;
  // 对 download-git-repo 进行 promise 化改造
  await wrapLoading(util.promisify(downloadGitRepo), 'waiting downloading template', request_url, path.resolve(process.cwd(), target_dir));
}

// 获取用户选择的模版
// 1)从远程拉取数据模版
// 2)用户选择自己新下载的模版名称
// 3)return 用户选择的名称

class Generator {
  constructor(name, target_dir) {
    this.name = name;
    this.target_dir = target_dir;
  }


  // 核心创建逻辑
  async create() {
    const repo = await getRepo();
    const tag = await getTag(repo);
    await downTemplate(repo, tag, this.target_dir);
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`);
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
    console.log('  npm run dev\r\n');
  }

}

module.exports = Generator