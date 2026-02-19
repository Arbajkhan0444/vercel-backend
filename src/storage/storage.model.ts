import { model, Schema } from 'mongoose'

const schema = new Schema({
	
},{timestamps: true})

const StorageModel = model('Storage', schema)
export default StorageModel