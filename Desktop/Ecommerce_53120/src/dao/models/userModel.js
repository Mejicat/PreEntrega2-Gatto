import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import { createHash } from "../../utils/bcrypt.js"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        required: true
    },
    last_name: {
        type: String,
        minLength: 3,
        required: true
    },
    email: {
        type: String,
        minLength: 5,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 18,
        required: true
    },
    password: {
        type: String,
        hash: true,
        minLength: 5,
        required: true
    },
    role: {
        type: String,
        require: true,
        enum: ['usuario', 'admin', 'premium'],
        default: 'usuario'
    },
    verified: {
        type: Boolean,
        default: false
    },
    documents: { 
        type: [{ name: String, 
            reference: String }] 
    },
    last_connection: {
        type: Date
    },
    cart: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'carts'
                }
            }
        ],
        default: []
    }
})

userSchema.plugin(mongoosePaginate)

userSchema.pre("save", function () {
    this.password = createHash(this.password)
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel