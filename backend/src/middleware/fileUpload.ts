import multer from 'multer'

// Stockage en mémoire, car on va uploader vers GridFS directement en buffer
const storage = multer.memoryStorage()

export const upload = multer({
	storage,
	limits: {
		fileSize: 500 * 1024 * 1024 // 500 Mo max
	},
	fileFilter: (req, file, cb) => {
		const allowedTypes = [
			'image/jpeg', 'image/png', 'image/gif',
			'audio/mpeg', 'audio/wav',
			'video/mp4', 'video/webm',
			'text/plain', 'text/html'
		]

		if (allowedTypes.includes(file.mimetype)) {
			cb(null, true)
		} else {
			cb(new Error('Type de fichier non autorisé'))
		}
	}
})
