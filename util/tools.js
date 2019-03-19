//工具函数模块
const {parseString} = require('xml2js')
module.exports = {
    //用来获取用户发送的消息
    getUserDataAsync(req){
        return new Promise((resolve,reject)=>{
            let xmlData = ''
            req
                .on('data',(data)=>{
                    xmlData +=data.toString()
                })
                .on('end',()=>{
                    //数据接收完毕
                    resolve(xmlData)
                })
        })
    },
    //解析XML数据
    parseXMLData(XMLData){
        let jsData = null;
        parseString(XMLData,{trim:true},(err,result)=>{
            if(!err){
                jsData = result;
            }else{
                jsData={};
            }
        })
        return jsData;
    },
    //格式化数据
    formatJsData(jsData){
        const {xml} = jsData;
        const userData = {};
        for(let key in xml){
            //去掉属性值
            const value = xml[key]
            console.log(value);
            //去掉数组
            userData[key] = value[0]
        }
        return userData
    }
}