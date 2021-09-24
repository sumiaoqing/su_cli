// lib/http.js

const service = require('axios')

/**
 * 获取模版列表
 * @returns Promise
 */
async function getRepoList() {
  return await service.get('https://api.github.com/users/sumiaoqing/repos');
}

/**
 * 获取版本列表
 * @params {string}  repo模版名称
 * @returns Promise
 */
async function getTagList(repo) {
  return await service.get(`https://api.github.com/repos/sumiaoqing/${repo}/tags`);
}

module.exports = {
  getRepoList,
  getTagList
}




