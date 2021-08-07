const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.cpy6i.mongodb.net/LIBRARY?retryWrites=true&w=majority');
const Schema=mongoose.Schema;

const DraftSchema=new Schema({
    draftID:String,
    ID:String,
    name:String,
    email:String,
    phonenumber:Number,
    dob:String,
    gender:String,
    address:String,
    about:String,
    photo:String,
    education:Array,
    job:Array,
    skills:Array,
    achievements:String,
    languages:Array
})
var Draftdata=mongoose.model("draftdata",DraftSchema);

module.exports=Draftdata;