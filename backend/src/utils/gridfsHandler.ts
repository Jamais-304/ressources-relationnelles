import { MongoClient, GridFSBucket, ObjectId } from 'mongodb'
import { Readable } from 'stream'

const mongoUri = process.env.MONGO_URI || '' //FIXME: add default value or handle error if not set
const dbName = process.env.DB_NAME

export const categorySizeLimit: Record<string, number> = {
	"TEXT": 1 * 1024 * 1024,     // 1 Mo
	"HTML": 1 * 1024 * 1024,     // 1 Mo
	"IMAGE": 10 * 1024 * 1024,   // 10 Mo
	"AUDIO": 10 * 1024 * 1024,   // 10 Mo
	"VIDEO": 500 * 1024 * 1024   // 500 Mo
}

export const allowedMimeTypes: Record<string, string[]> = {
	TEXT: ['text/plain'],
	HTML: ['text/html'],
	VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
	AUDIO: ['audio/mpeg', 'audio/ogg', 'audio/wav'],
	IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
}

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


export const getFromGridFS = async (fileId: string): Promise<Buffer> => {
	const { client, bucket } = await connectGridFS()
	try {
		const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
		const chunks: Buffer[] = []

		return await new Promise((resolve, reject) => {
			downloadStream
				.on('data', (chunk) => chunks.push(chunk))
				.on('end', () => resolve(Buffer.concat(chunks)))
				.on('error', (err) => reject(err))
		})
	} finally {
		await client.close()
	}
}