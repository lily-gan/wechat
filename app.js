const express = require('express')
const sha1 = require('sha1')
const {parseString} = require('xml2js')
const app = express()

app.use(async(req,res)=> {
    console.log(req.query);
    const {signature, echostr, timestamp, nonce} = req.query
    const token = 'rest_dexk211';
    const sortedArr = [token, timestamp, nonce].sort()
    // console.log(sortedArr)
    const sha1Str = sha1(sortedArr.join(''))
    if (req.method === 'GET') {
        //消息来自微信服务器
        if (sha1Str === signature) {
            res.end(echostr)
        } else {
            res.end('error')
        }
    } else if (req.method === 'POST') {
        if (sha1Str !== signature) {
            res.end('error')
            return;
        }
        //获取到了用户发送过来的消息
        const xmlData = await new Promise((resolve, reject) => {
            let xmlData = '';
            req
                .on('data', data => {
                xmlData += data.toString();
            })
                .on('end', () => {
                    resolve(xmlData)
                })
        })
        let jsData = null;
        parseString(xmlData, {trim: true}, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        })
        //格式化jsData
        const {xml} = jsData;
        let userData = {};
        for (let key in xml) {
            //取到属性值
            const value = xml[key];
            //去掉数组
            userData[key] = value[0];
        }
        console.log(userData);
        //实现自动回复
        let content = '你说什么,我听不懂';
        if (userData.Content === '1') {
            content = '大吉大利,今晚吃鸡';
        } else if (userData.Content.indexOf('2') !== -1) {
            content = '你属什么?<br>我属龙'
        }
        let replyMessage = `<xml>
      <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
    </xml>`
        //返回响应
        res.end(replyMessage)
    } else {
        res.end('error')
    }
})

app.listen(3000,(err)=>{
    if(!err){
        console.log('服务器连接成功')
    }else{
        console.log(err)
    }
})
