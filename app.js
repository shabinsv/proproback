const express=require("express");
const port=process.env.PORT || 3000;
const Userdata=require("./src/model/Userdata");
const Resumedata=require("./src/model/Resumedata");
const Draftdata=require("./src/model/Draftdata");
const Contactdata=require("./src/model/contactdata");
const cors=require('cors');
var jwt = require('jsonwebtoken');
var bodyparser=require('body-parser');
const app= new express();
var multer= require('multer');
var nodemailer = require('nodemailer');
var xxa="";
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, '/public/images');
      },
      filename: function (req, file, cb) {
       xxa=file.originalname;
        cb(null,  file.originalname);
      }
  })
  var upload = multer({ storage: storage })


app.use(cors());
app.use(express.static("./public"));
app.use(bodyparser.json());
const username= 'admin@gmail.com';
const password='12345678';

function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

app.post("/signup",function(req,res){

  var userData=req.body;
  Userdata.findOne({email:userData.email})
  .then(function(data){
   
    if(data.email==userData.email){
      res.send({ boolean: false, alert:'Email Already Found' })
    }
    else{
     
      var data={
        username: userData.username,
        email: userData.email,
        password:userData.password,
        phonenumber:userData.mobileno,
        star:userData.star
  }
var data=Userdata(data);
data.save();

sendmail();
function sendmail(){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'mailfromResumeBuilder@gmail.com',
           pass: 'xeknaduiwqpnudgm'
       }
   });

   const mailOptions = {
    from: 'mailfromResumeBuilder@gmail.com', 
    to: userData.email, 
    subject: 'sending mail', 
    text: `Thanks For Using ResumeBuilder your Password is ${userData.password} `
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}
res.send({ boolean: true, alert:'Account Created..Password Send To Mail',nav:'login' })
    }
  }).catch(()=>{
   
  var data={
        username: userData.username,
        email: userData.email,
        password:userData.password,
        phonenumber:userData.mobileno,
        star:userData.star
  }
var data=Userdata(data);
data.save();

sendmail();
function sendmail(){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'mailfromResumeBuilder@gmail.com',
           pass: 'xeknaduiwqpnudgm'
       }
   });

   const mailOptions = {
    from: 'mailfromResumeBuilder@gmail.com', 
    to: userData.email, 
    subject: 'sending mail', 
    text: `Thanks For Using ResumeBuilder your Password is ${userData.password} `
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}
res.send({ boolean: true, alert:'Account Created..Password Send To Mail',nav:'login' })
});
})

app.post("/login",function(req,res){
      console.log(req.body);
      var userData=req.body;
      if (username ==userData.username && password ==userData.password) {
            var navigation='admin';
            let payload={subject:username+password}
           let token=jwt.sign(payload,'secretKey')
            res.send({ boolean: true, token, nav: navigation,ID:'Admin' })
            console.log({ boolean: true, token, nav: navigation });
          }
          else{
            Userdata.findOne({email:userData.username})
            .then(function(data){
             var x=data.password;
              if(x==userData.password){
                var UserId=data._id;
                var navigation='user';
                let payload={subject:username+password}
               let token=jwt.sign(payload,'secretKey')
                res.send({ boolean: true, token, nav: navigation,ID:UserId})
                console.log({ boolean: true, token, nav: navigation,ID:UserId });
              }
              else{
                      res.send({boolean: false, data: 'Password Wrong' })
              }
            }).catch(function(){
          
              res.send({boolean: false, data: 'Email Not Found' });
              
            });
            
          }   
})
app.get("/check/:id",function(req,res){
  var id = req.params.id;
  Resumedata.findOne({ID:id})
  .then(function(data){
    if(data.ID==id){
      
      res.send(true);
    }
    else{
      
      res.send(false)
    }
  }).catch(function(){
   
    res.send(false)
  })
})

app.post("/image/:id",upload.single('image'),function(req,res){
  id = req.params.id;
  Resumedata.updateOne({"ID":id},
  {$set:{"photo":"/api/public/images/"+xxa
}}).then(function(){
  console.log("ok");
  res.send();
});
  
  });
app.post("/form1",verifyToken,function(req,res){
  console.log(req.body);

  var resume={
    ID:req.body.ID,
    name:req.body.name,
    email:req.body.email,
    phonenumber:req.body.phonenumber,
    dob:req.body.dob,
    gender:req.body.gender,
    address:req.body.address,
    about:req.body.about,
    photo:req.body.photo,
    video:req.body.video,
    education:req.body.education,
    job:req.body.job,
    skills:req.body.skills,
    achievements:req.body.achievements,
    languages:req.body.languages
   } 
   var resume=new Resumedata(resume);
   resume.save();
   res.send({data:'ok'});
});

app.get("/usercvdata/:id",function(req,res){
  const id = req.params.id; 
 Resumedata.findOne({"ID":id})
  .then((cvdata)=>{
     res.send(cvdata);
  })
});

app.put('/updateform',verifyToken,(req,res)=>{
  console.log(req.body);
  id=req.body._id,
  ID=req.body.ID,
    name1=req.body.name,
    email=req.body.email,
    phonenumber=req.body.phonenumber,
    dob=req.body.dob,
    gender=req.body.gender,
    address=req.body.address,
    about=req.body.about,
    photo=req.body.photo,
    education=req.body.education,
    job=req.body.job,
    skills=req.body.skills,
    achievements=req.body.achievements,
    languages=req.body.languages
 Resumedata.findOneAndUpdate({"ID":ID},
                              {$set:{"name":name1,
                                "email":email,
                                "phonenumber":phonenumber,
                                "dob":dob,
                                "gender":gender,
                                "address":address,
                               "about":about,
                                "photo":photo,
                                "education":education,
                                "job":job,
                                "skills":skills,
                                "achievements":achievements,
                                "languages":languages
                          }})
 .then(function(){
     res.send();
 });
});

app.delete("/deletedata/:id",verifyToken,(req,res)=>{
   
  id = req.params.id;
  Resumedata.findOneAndDelete({"ID":id})
  .then(()=>{
      console.log('success')
      res.send({data:"Deleted ResumeData From Server"});
  });
});

app.post("/getlink",verifyToken,function(req,res){
  console.log(req.body);
  var id = req.body.accountid; 
  var cvid = req.body.id;
  var temp=req.body.temp;
  
 Userdata.findById({"_id":id})
  .then((data)=>{
       var link=`${temp}/${cvid}`
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'mailfromResumeBuilder@gmail.com',
           pass: 'xeknaduiwqpnudgm'
       }
   });

   const mailOptions = {
    from: 'mailfromResumeBuilder@gmail.com', 
    to: data.email, 
    subject: 'sending mail', 
    text: `Thanks For Using ResumeBuilder your cv link is ${link}`
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
  })
});


app.get("/data/:id",function(req,res){
  const id = req.params.id; 
 Resumedata.findById({"_id":id})
  .then((cvdata)=>{
    if(cvdata ==null){
      Draftdata.findOne({"draftID":id}).then((data)=>{
        res.send(data);
      })
    }
    else{
      res.send(cvdata);
    }
     
  }).catch(()=>{
    Draftdata.findOne({"draftID":id}).then((data)=>{
      res.send(data);
    })
  })
});


app.get("/draftdata/:id",verifyToken,(req,res)=>{
   
  id = req.params.id;
  Resumedata.findOne({"ID":id})
  .then((data)=>{
     
      var resume={
        draftID:data._id,
        ID:data.ID,
        name:data.name,
        email:data.email,
        phonenumber:data.phonenumber,
        dob:data.dob,
        gender:data.gender,
        address:data.address,
        about:data.about,
        photo:data.photo,
        education:data.education,
        job:data.job,
        skills:data.skills,
        achievements:data.achievements,
        languages:data.languages
       } 
       var resume=new Draftdata(resume);
   resume.save();
   Resumedata.findByIdAndDelete({"_id":data._id})
  .then(()=>{
      console.log('success')
      res.send({data:"Resume drafted"});
  });
   
  });
});

app.get("/loaddraftdata/:id",(req,res)=>{
   
  id = req.params.id;
  Draftdata.find({"ID":id})
  .then((data)=>{
     res.send(data);
     console.log(data);
  });
});

app.get("/changeuserdata/:id",verifyToken,(req,res)=>{
   
  id = req.params.id;
  Draftdata.findOne({"draftID":id})
  .then((data)=>{
      console.log(data)
      var resume={
        ID:data.ID,
        name:data.name,
        email:data.email,
        phonenumber:data.phonenumber,
        dob:data.dob,
        gender:data.gender,
        address:data.address,
        about:data.about,
        photo:data.photo,
        education:data.education,
        job:data.job,
        skills:data.skills,
        achievements:data.achievements,
        languages:data.languages
       } 
       var resume=new Resumedata(resume);
   resume.save();
   Draftdata.findOneAndDelete({"draftID":id})
  .then(()=>{
      console.log('success')
      res.send({data:"Resume drafted"});
  });
   
  });
});

app.get("/getusers",function(req,res){
 Userdata.find()
  .then(function(users){
    res.send(users);
  });
});

app.post("/contactus",function(req,res){
  console.log(req.body);

  var contact={
    
    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
   comment:req.body.comment
    
   } 
   var contact=new Contactdata(contact);
   contact.save();
});

app.put('/user/rate',(req,res)=>{
    id=req.body.ID
    star=req.body.value
  Userdata.findByIdAndUpdate({"_id":id},
                              {$set:{"star":star}})
                              .then(function(){
                                res.send();
                            });
                          });

app.delete("/deleteuser/:id",(req,res)=>{
   
  id = req.params.id;
  Userdata.findByIdAndDelete({"_id":id})
  .then(()=>{
      console.log('success')
      res.send({data:"Deleted ResumeData From Server"});
  });
});

app.get("/getmessage",function(req,res){
  Contactdata.find()
   .then(function(users){
     res.send(users);
   });
 });

 app.post("/messageback",function(req,res){

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'mailfromResumeBuilder@gmail.com',
           pass: 'xeknaduiwqpnudgm'
       }
   });

   const mailOptions = {
    from: 'mailfromResumeBuilder@gmail.com', 
    to: req.body.email, 
    subject: 'sending mail', 
    text: req.body.mess
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
 });

 app.put('/uploadvideo',verifyToken,(req,res)=>{
  console.log(req.body);
  var Url=req.body.Url;
    var vid_id = Url.split("v=")[1].substring(0, 11);
    var ID=req.body.ID;
  
 Resumedata.findOneAndUpdate({"ID":ID},
                              {$set:{"video": vid_id 
                                
                          }})
 .then(function(){
     res.send();
 });
});



app.listen(port,function(){
  console.log("Server Ready at " +port);
});