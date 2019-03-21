/*定义获取access_token的模块
* 1.是什么
*       是公众号的全局唯一接口调用凭据,公众号调用各接口时都需使用access_token
* 2.特点
*       有效时间2小时(2小时必须更新1次,重复获取将导致上次获取的access_token失效)
*       唯一性
*       大小:512字符
* 3.请求地址
*      https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
* 4.请求方式
*       GET
* 5.设计
*       --第一次:发送请求,获取access_token,保存起来,设置过期时间
*       --第二次:读取本地保存access_token,保存起来,设置过期时间
* 6.整理
*       一上来读取本地保存的access_token
*       有:  判断有没有过期
*           没有过期:直接使用
*           过期了:重新发送请求,获取access_token,保存起来,设置过期时间
*       没有: 发送请求,获取access_token,保存起来,设置过期时间
*
* */
const rp = require('request-promise-native')
const {writeFile,readFile} = require('fs')

//发送请求,获取access_token,保存起来,设置过期时间
async function getAccessToken() {
    const appId = 'wxf01dbac83e564640';
    const appSecret = '4d171b7a7aac258102b3e005299f4526';
    //定义请求
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}
`
    //发送请求
    //使用第三方库 request-promise-native
    const result = await rp({method: 'GET', url, json: true});
    result.expires_in = Date.now() + 7200000 - 300000;
    writeFile('./accessToken.txt', JSON.stringify(result), err => {
        if (!err) {
            console.log('文件写入成功');
        } else {
            console.log(err);
        }
    })
    //返回获取到的access_Token
    return result;
}

//获取最终有效的access_token
module.exports = function fetchAccessToken() {
    return new Promise((resolve, reject) => {
        readFile('./accessToken.txt', (err, data) => {
            if (!err) {
                resolve(JSON.parse(data.toString()))
            } else {
                reject(err)
            }
        })
    })
        .then(res => {
            if(res.expires_in < Date.now()){
                //promise内部有access_token
                return getAccessToken();
            }else{
                return res;
            }
        })
        .catch(err => {
            return getAccessToken();
        })
}
