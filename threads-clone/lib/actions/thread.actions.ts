"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

type Params =  {
    text: string,
    author: string,
    communityId: string | null,
    path: string
}   

export async function createThread ({text, author, communityId, path}: Params) {
    try {
        connectToDB();
        const createdThread = await Thread.create({ text, author, community: null });
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        });
    } catch (error: any) {
        throw new Error("There's an Error while create/update the user's thread", error);
    }    

    revalidatePath(path); // make sure that the changes have been happened immediately.
};

export async function getThreads(pageNumber=1, pageSize=20) {
    try {
        connectToDB();

        // calculate the number of the post to skip.
        const skipAmount = (pageNumber - 1) * pageSize;

        // fetch the posts that have no parents (top-level threads...)
        const postsQuery = Thread
            .find({parentId: {$in: [null, undefined]}})
            .sort({createdAt: 'desc'})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({path: 'author', model: User})
            .populate({
                path: 'children',
                populate: {
                    path: 'author',
                    model: User,
                    select: "_id name parentId image"
                }
            });

            const posts = await postsQuery.exec();
            
            const totalPostsCount = await Thread.countDocuments({parentId: {$in:[null, undefined]}});
            const isNext = totalPostsCount > skipAmount + posts.length;

            return {posts, isNext};

    } catch (error: any) {
        throw new Error("Failed to fetch Threads: ", error.message);
    }
}