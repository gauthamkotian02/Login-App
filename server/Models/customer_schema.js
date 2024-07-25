const mongoose=require('mongoose')
const {Schema}=mongoose;

const customerSchema=new Schema({
    name:{type:String},
    email:{type:String},
    phone: { type: String },
    password: { type: String },
    profile: { type: String }
})
module.exports=mongoose.model("customer",customerSchema)