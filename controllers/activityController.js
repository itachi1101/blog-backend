const Activity = require('../models/activity')

// create activity
module.exports.createActivity = async (req, res) => {
    try {
        const { postId, userId, likeCounter } = req.body
        const activity = await Activity.create({
            postId, userId, likeCounter
        })
        res.status(201).send(activity)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}


// update activity
module.exports.updateActivity = async (req, res) => {
    try {
        const {postId}=req.body
        const updatedActivity = await Activity.findOneAndUpdate(
            { postId: postId },
            { likeCounter: likeCounter + 1 },
            { new: true }
        )
        res.status(200).send(updatedActivity)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}


// get activity
module.exports.getActivity = async (req, res) => {
    try {
        const post = await Activity.find().sort({ likeCounter: -1 }).limit(4)
        res.status(200).send(post)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

// delete activity
module.exports.deleteActivity = async (req, res) => {
    try {
        const { postId } = req.body
        await Activity.findOneAndDelete({ postId })
        res.status(200).send("Successfully deleted activity")
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}
