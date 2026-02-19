import mongoose, { model, Schema } from 'mongoose'

const schema = new Schema({
	user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ebook: {
        type: mongoose.Types.ObjectId,
        ref: 'Ebook',
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed']
    }
},{timestamps: true})

const OrderModel = model('Order', schema)
export default OrderModel