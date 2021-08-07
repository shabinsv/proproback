const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.cpy6i.mongodb.net/LIBRARY?retryWrites=true&w=majority');
const Schema=mongoose.Schema;

const ResumeSchema=new Schema({
    ID:String,
    name:String,
    email:String,
    phonenumber:Number,
    dob:String,
    gender:String,
    address:String,
    about:String,
    photo:String,
    video:String,
    education:Array,
    job:Array,
    skills:Array,
    achievements:String,
    languages:Array
})
var Resumedata=mongoose.model("resumedata",ResumeSchema);

module.exports=Resumedata;