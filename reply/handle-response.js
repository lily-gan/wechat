module.exports = (userData) => {
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',
        content: '你说什么?我听不懂'
    }
    if (userData.MsgType === 'text') {
        //说明用户发送的是文本消息
        if (userData.Content === '1') {
            options.content = '我是小猪佩奇,你是谁呀?'
        } else if (userData.Content && userData.Content.indexOf('2') !== -1) {
            options.content = '青青草原的大灰狼'
        }
    } else if (userData.MsgType === 'voice') {
        //将用户发送的语音消息,返回语音识别结果给用户(需要开通才能生效)
        options.content = userData.Recognition
    } else if (userData.MsgType === 'location') {
        //用户发送的是地理位置消息
        options.content = `地理位置纬度:${userData.Location_X}
        \n地理位置经度:${userData.Location_Y}
        \n地图缩放大小:${userData.Scale}
        \n地理位置信息:${userData.Label}`
    } else if (userData.MsgType === 'event') {
        if (userData.Event === 'subscribe') {
            //用户订阅事件
            options.content = '欢迎你关注公众号'
            if (userData.EventKey) {
                //扫描带参数的二维码--->不是普通二维码,活动中使用
                options.content = '欢迎扫描带参数二维码,关注公众号'
                console.log('取消关注')
                //options.content 如果不给值,微信服务器会请求三次
            }
        } else if (userData.Event === 'unsubscribe') {
            console.log('取消关注了');
        } else if (userData.Event === 'CLICK') {
            //用户点击菜单
            options.content = '用户点击了菜单'
        }
    }
    return options
}