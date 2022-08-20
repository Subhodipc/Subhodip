const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const TokenSchema= new Schema({
    _userId:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
        // The ref option is what tells Mongoose which model to use during population(Reference of another schema)
    },
    token:{
        type: String,
        required: true
    }
});

const TokenModel= new mongoose.model("token",TokenSchema);
module.exports=TokenModel;

