const mongoose = require('mongoose')

const activitySchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
            unique:true
        },
        userId: {
            type: String,
            required: true,
        },
        likeCounter: {
            type: Number,
            default: 0
        },
    }
)


const Activity = mongoose.model("Activity", activitySchema)
module.exports = Activity