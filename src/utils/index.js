import path from 'path';
import fs from 'fs';
import { shell } from 'electron';
import EncUtf8 from 'crypto-js/enc-utf8';
import { AES } from 'crypto-js';
//const download = require('download-git-repo');
// 创建目录
export function mkdirsSync(dirname) {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
  return false;
}
// 拷贝文件
export function copyDir(src, dst) {
  // 读取目录中的所有文件/目录
  let paths = fs.readdirSync(src);
  paths.forEach(function (path) {
    let _src = src + '/' + path,
      _dst = dst + '/' + path,
      readable,
      writable;
    let st = fs.statSync(_src);
    // 判断是否为文件
    if (st.isFile()) {
      // 创建读取流
      readable = fs.createReadStream(_src);
      // 创建写入流
      writable = fs.createWriteStream(_dst);
      // 通过管道来传输流
      readable.pipe(writable);
    } else if (st.isDirectory()) {
      // 如果是目录则递归调用自身
      // 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
      // 已存在
      if (fs.existsSync(_dst)) {
        copyDir(_src, _dst);
      } else {
        // 不存在
        fs.mkdirSync(_dst);
        copyDir(_src, _dst);
      }
    }
  });
}
// 浏览器打开url
export function openUrlWithBrowser(url) {
  shell.openExternal(url);
}
// 时间格式化
export function formatTimestamp(time = 0, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (time === 0 || !time) {
    return '';
  }

  let date = new Date(time);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length));
    }
  }
  return fmt;
}
/**
 * 加密
 */
export const encrypt = (word, salt) => {
  let srcs = EncUtf8.parse(word);
  let encrypted = AES.encrypt(srcs, salt);
  return encrypted.toString();
};
/**
 * 解密
 */
export const decrypt = (cryptWord, salt) => {
  let decrypt = AES.decrypt(cryptWord, salt);
  return EncUtf8.stringify(decrypt).toString();
};

/**
 * 将一维数组格式转换成树结构
 * TODO: 考虑使用尾递归优化算法
 * @param {*} data  需要转换的数据
 * @param {*} pid   顶级节点的id
 * @param {*} children   子集标识key
 * @param {*} pidName    父级标识key
 * @param {*} idName     id标识key
 */
export function convertToTree({ data, pid = 0, children = 'children', pidName = 'parentId', idName = 'id' }) {
  let arr = [];
  data.map((item) => {
    if (item[pidName] === pid) {
      let child = item[children] || [];
      let temp = child.concat(convertToTree({ data, pid: item[idName], children, pidName, idName }));
      temp.length && (item[children] = temp);
      return arr.push(item);
    }
  });
  return arr;
}
