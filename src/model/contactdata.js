const mongoose=require("mongoose");
mongoose.connect('mongodb+srv://userone:userone@ictakfiles.cpy6i.mongodb.net/LIBRARY?retryWrites=true&w=majority');
const Schema=mongoose.Schema;

const ContactSchema=new Schema({
    fname:String,
    lname:String,
    email: String,
    comment:String
    
})
var Contactdata=mongoose.model("contactdata",ContactSchema);

module.exports=Contactdata;