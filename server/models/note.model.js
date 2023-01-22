const mongoose = require('mongoose')

const Note = new mongoose.Schema(
	{
		title: { type: String, required: true },
		email: { type: String, required: true },
		note: { type: String, required: true },
		// password: {type:String},
		time: { type: String },

	},
	{ collection: 'notes' }
)

const model = mongoose.model('Notes', Note)

module.exports = model
