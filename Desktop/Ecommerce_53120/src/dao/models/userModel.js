import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"
import { createHash } from "../../utils/bcrypt.js"

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
        hash: true,
        minLength: 5,
        require: true
    },
    role: {
        type: String,
        default: 'user'
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

userSchema.pre("save", function(){
    this.password = createHash(this.password)
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel