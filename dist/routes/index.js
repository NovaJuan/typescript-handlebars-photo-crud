"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_extra_1 = require("fs-extra");
const Post_1 = __importDefault(require("../models/Post"));
const router = express_1.Router();
router.get('/', async function (req, res) {
    try {
        const posts = await Post_1.default.find();
        res.render('index', { posts });
    }
    catch (err) {
        console.log(err);
        return res.send('Something went wrong.');
    }
});
router.route('/add')
    .get(function (req, res) {
    res.render('add_post');
})
    .post(async function (req, res) {
    try {
        const { title, description, user } = req.body;
        const newPost = new Post_1.default({
            title,
            description,
            user: user.toLowerCase().replace('@', '')
        });
        if (req.file) {
            newPost.image = {
                path: req.file.path,
                filename: req.file.filename
            };
        }
        await newPost.save();
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
        res.send('Something went wrong');
    }
});
router.get('/user/:user', async function (req, res) {
    try {
        const { user } = req.params;
        const posts = await Post_1.default.find({ user });
        return res.render('user_post', { user, posts });
    }
    catch (err) {
        console.log(err);
        return res.send('Something went wrong');
    }
});
router.get('/delete/:id', async function (req, res) {
    try {
        const { id } = req.params;
        const post = await Post_1.default.findByIdAndDelete(id);
        if (post.image.path) {
            await fs_extra_1.unlink(post.image.path);
        }
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
        res.send('Something went wrong');
    }
});
router.route('/edit/:id')
    .get(async function (req, res) {
    try {
        const { id } = req.params;
        const post = await Post_1.default.findById(id);
        res.render('edit_post', { post });
    }
    catch (err) {
        console.log(err);
        res.send('Something went wrong.');
    }
})
    .post(async function (req, res) {
    try {
        const { id } = req.params;
        const { title, description, user, oldImagePath, oldImageFilename, oldTitle, oldDescription, oldUser } = req.body;
        const editedPost = {
            title: "",
            description: "",
            user: "",
            image: {
                path: "",
                filename: ""
            }
        };
        if (title) {
            editedPost.title = title;
        }
        else {
            editedPost['title'] = oldTitle;
        }
        if (description) {
            editedPost['description'] = description;
        }
        else {
            editedPost['description'] = oldDescription;
        }
        if (user) {
            editedPost['user'] = user;
        }
        else {
            editedPost['user'] = oldUser;
        }
        if (req.file) {
            editedPost['image'] = {
                path: req.file.path,
                filename: req.file.filename
            };
            if (oldImagePath) {
                await fs_extra_1.unlink(oldImagePath);
            }
        }
        else {
            editedPost['image'] = {
                path: oldImagePath,
                filename: oldImageFilename
            };
        }
        console.log(editedPost);
        await Post_1.default.findByIdAndUpdate(id, editedPost);
        res.redirect('/');
    }
    catch (err) {
        console.log(err);
        res.send('Something went wrong.');
    }
});
exports.default = router;
