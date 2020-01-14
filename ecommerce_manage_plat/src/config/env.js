/**
 * 配置编译环境和线上环境
 */

let baseUrl = '';
let routerMode = 'hash';
let baseImgPath;
let pageSize = 10

if (process.env.NODE_ENV == 'development') {
  baseUrl = 'https://tsapi.chetuobang.com';
  // baseUrl = 'https://tsapi.chetuobang.com';
  // baseUrl = 'https://www.easy-mock.com/mock/5c3c4a64687e5c3ded21833b/vm'
  // baseImgPath = '../assets/img/';
} else {
  baseUrl = 'https://tsapi.chetuobang.com';
  // baseUrl = 'https://tsapi.chetuobang.com';
  //   baseImgPath = '//elm.cangdu.org/img/';
}

export {
  baseUrl,
  routerMode,
  baseImgPath,
  pageSize
}
