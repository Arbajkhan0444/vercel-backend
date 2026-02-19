import express from 'express'
const StorageRouter = express.Router()
import { createFile, deleteFile, downloadFile, fetchStorage,  uploadPic } from './storage.controller'
import s3 from '../util/s3.util'
import multer from 'multer'
import multerS3 from 'multer-s3'
import {v4 as uniqueId} from 'uuid'
import { AdminGuard, AdminUserGuard } from '../middleware/guard.middleware'

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKET as string,
        key: (req, file, cb)=>{
            const {fieldname} = file
            const base = (fieldname === "file" ? process.env.BUCKET_FOLDER : process.env.PIC_FOLDER)
            const arr = file.originalname.split(".")
            const ext = arr[arr.length-1]
            cb(null, `${base}/${uniqueId()}.${ext}`)
        },
        acl: (req, file, cb)=>{
            const {fieldname} = file
            cb(null, fieldname === "file" ? 'private' : 'public-read')
        }
    })
})

StorageRouter.get('/', AdminGuard, fetchStorage)
StorageRouter.post('/', AdminGuard, upload.single('file'), createFile)
StorageRouter.post('/upload-pic', AdminUserGuard, upload.single('pic'), uploadPic)
StorageRouter.post('/download', AdminUserGuard, downloadFile)
StorageRouter.post('/delete', AdminGuard, deleteFile)

export default StorageRouter