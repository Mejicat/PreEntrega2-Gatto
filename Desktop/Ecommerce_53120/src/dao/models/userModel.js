import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        require: true
    },
    last_name: {
        type: String,
        minLength: 3,
        require: true
    },
    email: {
        type: String,
        minLength: 5,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        min: 18,
        require: true
    },
    password: {
        type: String,
        minLength: 5,
        require: true
    },
    role: {
        type: String,
        default: 'usuario' //rol por default definido en la consigna
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    }
})

userSchema.plugin(mongoosePaginate)

const userModel = mongoose.model(userCollection, userSchema)

export default userModel