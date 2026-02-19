import { model, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

const schema = new Schema({
	fullname: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    mobile: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user']
    },
    image: {
        type: String
    }
},{timestamps: true})

schema.pre('save', async function(next) {
    const encrypted = await bcrypt.hash(this.password.toString(), 12)
    this.password = encrypted
    next()
})

const UserModel = model('User', schema)
export default UserModel