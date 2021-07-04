module.exports = {
    lintOnSave: false,
    // 服务器代理设置
    devServer: {
        disableHostCheck: true,
        port: 9000,
        proxy: {
            '^/api': {
                // 洛天依网友网关
                // target: 'http: //timemeetyou.com:8889',
                // target: 'http://47.115.124.102:8888',
                // 黑马老师原网关
                target: 'https://www.liulongbin.top:8888',
            }
        }
    },
}