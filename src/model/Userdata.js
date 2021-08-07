const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.cpy6i.mongodb.net/LIBRARY?retryWrites=true&w=majority');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    username:String,
    email: String,
    password: String,
    phonenumber:Number,
    star:String
})
var Userdata=mongoose.model("userdata2",UserSchema);

module.exports=Userdata;