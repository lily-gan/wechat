const express = require('express')
const reply =require('./reply')
const app = express()

app.use(reply())

app.listen(4000,(err)=>{
    if(!err){
        console.log('服务器连接成功')
    }else{
        console.log(err)
    }
})
