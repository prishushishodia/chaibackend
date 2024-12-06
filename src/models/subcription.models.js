import mongoose, {schema} from "mongoose"

const subsciptionSchema= new schema({
    subscriber:{
        type: Schema.Types.ObjectID,// the one who is subscribing 
        ref: "user"
    },
    channel:{
         type: Schema.Types.ObjectID, 
        ref: "user"
    }
}, {timestamps: true})



export const Subsciption = mongoose.model("Subscription",subsciptionSchema)