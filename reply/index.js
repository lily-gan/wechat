const sha1 = require('sha1')
const {getUserDataAsync, parseXMLData, formatJsData} = require('../util/tools')
const template = require('./template')
const handleResponse = require('./handle-response')
module.exports = () => {
    return async (req, res) => {
        //微信服务器发送过来的请求参数
        console.log(req.query);
        const {signature, echostr, timestamp, nonce} = req.query
        const token = 'rest_dexk211'
        const sha1Str = sha1([token, timestamp, nonce].sort().join(''))
        /*
      { signature: 'efd377ff6ad1a1d57accc6d1848f1c7b9b9077f2',   微信加密签名
      echostr: '4809389192886745081', 微信后台生成的随机字符串
      timestamp: '1552966105',  微信后台发送请求的时间戳
      nonce: '1780047115' }     微信后台生成的随机数字
     */
        if (req.method === 'GET') {
            //开发者获得加密后的字符串可与signature对比,标识该请求来源于微信
            if (sha1Str === signature) {
                //说明消息来自于微信服务器
                res.end(echostr)
            } else {
                res.end('error')
            }
        } else if (req.method === 'POST') {
            //用户发送过来的消息
            //过滤掉不是微信服务器发送过来的消息
            if (sha1Str !== signature) {
                res.end('error')
                return
            }
            //获取到了用户发送过来的消息
            const xmlData = await getUserDataAsync(req)
            //将xml数据转换成js对象
            const jsData = parseXMLData(xmlData)
            //格式化jsData
            const userData = formatJsData(jsData)
            const options = handleResponse(userData)
            const replyMessage = template(options)

            console.log(replyMessage);
            //返回响应
            res.send(replyMessage)
        } else {
            res.end('error')
        }
    }
}