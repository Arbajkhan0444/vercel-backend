import { model, Schema } from 'mongoose'

const schema = new Schema({
	title: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        lowercase: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    ebook: [{
        type: String
    }]
},{timestamps: true})

const EbookModel = model('Ebook', schema)
export default EbookModel