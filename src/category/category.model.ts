import { model, Schema } from 'mongoose'

const schema = new Schema({
	title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
},{timestamps: true})

const CategoryModel = model('Category', schema)
export default CategoryModel