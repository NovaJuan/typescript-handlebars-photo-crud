"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        path: {
            type: String
        },
        filename: {
            type: String
        }
    },
    created_at: {
        type: Date,
        default: new Date(Date.now())
    }
});
const PostModel = mongoose_1.model('posts', PostSchema);
exports.default = PostModel;
