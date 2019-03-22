const rp = require('request-promise-native')
const fetchAccessToken = require('./access_token')
//菜单配置项
const menu = {
    "button": [
        {
            "type": "click",  // 单击菜单
            "name": "首页☀",
            "key": "home"
        },
        {
            "name": "菜单一🙏",
            "sub_button": [
                {
                    "type": "view",  // 跳转到指定网址
                    "name": "官网",
                    "url": "http://www.atguigu.com/"
                },
                {
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    "key": "扫码带提示"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "扫码推事件"
                },
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_0"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1"
                },
            ]
        },
        {
            "name": "菜单二🍀",
            "sub_button": [
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图👀",
                    "key": "rselfmenu_1_2"
                },
                {
                    "name": "发送位置🌂",
                    "type": "location_select",
                    "key": "rselfmenu_2_0"
                }
            ]
        },
    ]
}
//提取基本路径 BASEPATH
const BASE_PATH = 'https://api.weixin.qq.com/cgi-bin/'

//创建自定义菜单
async function createMenu() {
    //获取access_token
    const {access_token} = await fetchAccessToken()
    //定义请求地址
    const url = ` ${BASE_PATH}menu/create?access_token=${access_token}`
    //发送请求
    const result = await rp({method: 'POST', url, json: true, body: menu})
    return result
}

//删除菜单
async function deleteMenu() {
    //获取access_token
    const {access_token} = await fetchAccessToken()
    //定义请求地址
    const url = `${BASE_PATH}menu/delete?access_token=${access_token}`
    const result = await rp({method: 'GET', url, json: true})
    return result
}

/*创建标签名
* */
async function createTag(name) {
    const {access_token} = await fetchAccessToken();
    const url = `${BASE_PATH}tags/create?access_token=${access_token}`
    return await rp({method: 'POST', url, json: true, body: {tag: {name}}})
}

//获取标签下粉丝列表
async function getTagUsers(tagid, next_openid = '') {
    const {access_token} = await fetchAccessToken();
    const url = `${BASE_PATH}user/tag/get?access_token=${access_token}`
    return await rp({method: 'POST', url, json: true, body: {tagid, next_openid}})
}

//批量为多个用户打标签
async function batchUsersTag(openid_list, tagid) {
    const {access_token} = await fetchAccessToken();
    const url = `${BASE_PATH}tags/members/batchtagging?access_token=${access_token}`
    return await rp({method: 'POST', url, json: true, body: {openid_list, tagid}})
}

//设置用户名备注
async function userNote(openid, remark) {
    const {access_token} = await fetchAccessToken()
    const url = `${BASE_PATH}user/info/updateremark?access_token=${access_token}`
    return await rp({method: 'POST', url, json: true, body: {openid, remark}})
}

//获取用户基本信息
async function userMessage() {
    const {access_token} = await fetchAccessToken()
    const userid = 'oEMKh5_4f6AAdQZ3bl3WHIAp2pMI'
    const url = `${BASE_PATH}user/info?access_token=${access_token}&openid=${userid}&lang=zh_CN`;
    return await rp({method: 'GET', url, json: true})
}

//生成带参数的二维码
async function QuickMark(expire_seconds, action_name, action_info) {
    const {access_token} = await fetchAccessToken()
    const url = `${BASE_PATH}qrcode/create?access_token=${access_token}`
    return await rp({method: 'POST', url, json: true, body: {expire_seconds, action_name, action_info}})
}

(async () => {
    /*let result = await deleteMenu();
    console.log(result);
    result = await createMenu();
    console.log(result);*/
    /*let result1 = await createTag('大金毛')
    console.log(result1);
    let result2 = await batchUsersTag([
       'oEMKh5_4f6AAdQZ3bl3WHIAp2pMI'
    ],result1.tag.id)
    console.log(result2);*/
    /*  let result3 = await getTagUsers(result1.tag.id)
      console.log(result3);*/
    /*let result4 = await userNote('oEMKh55vs1fmGxgPXB2jcAwUCQcY', "一号用户")
    console.log(result4);*/
    let result5 = await userMessage();
    console.log(result5);
   /* let result6 = await QuickMark(604800, "QR_SCENE", {"scene": {"scene_str": "test"}})
    console.log(result6);*/
})()


