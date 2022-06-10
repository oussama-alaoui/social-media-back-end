const router = require('express').Router();

    // models
    const Post = require('../models/posts');
    const User = require('../models/user');


// create a new post
router.post('/', async (req, res) => {
    try {
        const  post = await new Post({
            userId: req.body.userId,
            desc: req.body.desc,
            image: req.body.image,
        });
        await post.save();
        res.status(200).json(post);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});

// get a post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const {password, updateAt, ...other} = post._doc;
        res.status(200).json(other);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});

// delete a posts
router.delete('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
        try {
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json('Post deleted');
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(400).json( 'You are not authorized to delete this post' );
    }
});

// update a posts
router.put('/:id', async (req, res) => {
    const post = Post.findOne(req.params.id);
    if (post.userId === req.body.userId) {
        try {
            const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.status(200).json("Post updated");
        }
        catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(400).json("You are not authorized to update this post");
    }
});

// like & disliked a post
router.put('/like/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.includes(req.body.userId)) {
            post.likes.pull(req.body.userId);
            await post.save();
            res.status(200).json("Post disliked");
        }
        else {
            post.likes.push(req.body.userId);
            await post.save();
            res.status(200).json("Post liked");
        }
    } catch (error) {
        return res.status(500).json(error); 
    }
});

// get timeline posts
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendposts = await Post.find({ userId: { $in: currentUser.following } });
      res.json(friendposts.concat(...userPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;