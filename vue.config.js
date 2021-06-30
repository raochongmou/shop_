module.exports = {
    lintOnSave: false,
    // 服务器代理设置
    devServer: {
        disableHostCheck: true,
        port: 9000,
        proxy: {
            '^/api': {
                // target: 'http://47.115.124.102:8888',
                target: 'https://www.liulongbin.top:8888',
            }
        }
    },
}