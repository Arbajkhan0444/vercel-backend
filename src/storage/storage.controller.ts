import StorageModel from './storage.model'
import mime from "mime-types"
import { Request, Response } from 'express'
import Exc from '../util/exc.util'
import { ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3 from '../util/s3.util'

export const fetchStorage = Exc(async (req: Request, res: Response)=>{
	const cmd = new ListObjectsV2Command({
        Bucket: process.env.BUCKET,
        Prefix: process.env.BUCKET_FOLDER
    })
    const data = await s3.send(cmd)
    res.json(data.Contents)
})

export const createFile = Exc((req: Request, res: Response)=>{
    res.json(req.file)
})

export const uploadPic = Exc((req: Request, res: Response)=>{
    res.json(req.file)
})

export const downloadFile = Exc(async (req: Request, res: Response)=>{
    const { type } = req.query
    const { path } = req.body
    const contentType = mime.lookup(path)

    const cmd = new GetObjectCommand({
        Bucket: process.env.BUCKET,
        Key: path
    })

    if(type !== "file")
    {
        const data = await getSignedUrl(s3, cmd, {expiresIn: 30})
        return res.json({url: data})
    }   

    const data: any = await s3.send(cmd)
    res.setHeader('Content-Type', contentType as string)
    res.setHeader('Content-Disposition', `inline; filename="${path.split("/").pop()}"`)
    data.Body.pipe(res).on('error', ()=>{
        res.status(424).json({message: 'File sending failed'})
    })
})

export const deleteFile = Exc(async (req: Request, res: Response)=>{
    const { path } = req.body
    const cmd = new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key: path
    })
    await s3.send(cmd)
    res.json({message: 'File deleted'})
})