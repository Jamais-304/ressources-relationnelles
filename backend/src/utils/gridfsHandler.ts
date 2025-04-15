import { MongoClient, GridFSBucket, ObjectId } from 'mongodb'
import { Readable } from 'stream'

const mongoUri = process.env.MONGO_URI || '' //FIXME: add default value or handle error if not set
const dbName = process.env.DB_NAME

const connectGridFS = async () => {
	const client = new MongoClient(mongoUri)
	await client.connect()
	const db = client.db(dbName)
	const bucket = new GridFSBucket(db)
	return { client, bucket }
}

export const uploadToGridFS = async (
	fileBuffer: Buffer,
	fileName: string,
	mimeType: string
): Promise<string> => {
	const { client, bucket } = await connectGridFS()

	try {
		const uploadStream = bucket.openUploadStream(fileName, {
			contentType: mimeType
		})

		const readable = new Readable()
		readable.push(fileBuffer)
		readable.push(null)

		return await new Promise((resolve, reject) => {
			readable
				.pipe(uploadStream)
				.on('finish', () => resolve(uploadStream.id.toString()))
				.on('error', (err) => reject(err))
		})
	} finally {
		await client.close()
	}
}

export const deleteFromGridFS = async (fileId: string): Promise<void> => {
	const { client, bucket } = await connectGridFS()
	try {
		await bucket.delete(new ObjectId(fileId))
	} finally {
		await client.close()
	}
}
