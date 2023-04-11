const express= require('express')
const bodyParser= require('body-parser')
const request= require('request')
const https  =require('https')
const app= express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))
// apiKey= '5b6bfd93a2ad96ec7f500163efb9b3d8-us13'
// aud id 2b730d6fde

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/signup.html')
})

app.post('/',(req,res)=>{
    const firstName= req.body.fname
    const secondName= req.body.sname
    const email= req.body.email

    const data ={
        members:[
            {
                email_address: email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: secondName
                }
            }
        ]
    }
    const jsonData= JSON.stringify(data)
    const url= 'https://us13.api.mailchimp.com/3.0/lists/2b730d6fde'
    const options={
        method:'POST',
        auth:'aash:5b6bfd93a2ad96ec7f500163efb9b3d8-us13'
    }
   const request= https.request(url,options,(response)=>{
        if (response.statusCode===200){
            res.sendFile(__dirname+'/success.html')
        }else{
            res.sendFile(__dirname+'/failure.html')
        }

        response.on('data',(data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData)
    request.end()
})
app.post('/failure',(req,res)=>{
    res.redirect('/')
})

app.listen(process.env.PORT || 3000,()=>{
    console.log('server is started at port 3000...');
})