export default function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages();    //获取加载的页面
  var currentPage = pages[pages.length - 1];  //获取当前页面的对象
  var url = currentPage.route;  //当前页面url
  var options = currentPage.options;   //获取url中所带的参数
  //拼接url的参数
  var currentPage = url + '?';
  for (var key in options) {
    var value = options[key]
    currentPage += key + '=' + value + '&';
  }
  currentPage = currentPage.substring(0, currentPage.length - 1);
  return currentPage
}