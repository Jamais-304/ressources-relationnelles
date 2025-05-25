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

export const getStreamFileFromGridFS = async (
	fileId: string
): Promise<{
	stream: NodeJS.ReadableStream
	metadata: any
}> => {
	const { client, bucket } = await connectGridFS()
	
	const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray()

	if (files.length === 0) {
		await client.close() // Fermer la connexion seulement en cas d'erreur
		throw new Error(`File not found in GridFS: ${fileId}`)
	}

	const fileInfo = files[0]
	const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

	// Fermer la connexion quand le stream est fini ou en erreur
	downloadStream.on('end', () => {
		client.close()
	})
	
	downloadStream.on('error', () => {
		client.close()
	})

	return {
		stream: downloadStream,
		metadata: fileInfo,
	}
}