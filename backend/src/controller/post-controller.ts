import { Request, Response } from "express";
import prisma from "../prisma-client";

const postController = {
  async listPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          memberPostedBy: {
            include: {
              user: true,
            },
          },
          votes: true,
          comments: true,
        },
        orderBy: {
          dateCreated: "desc",
        },
      });

      const formattedPosts = posts.map((post) => {
        const upvotes = post.votes.filter(
          (vote) => vote.voteType === "Upvote",
        ).length;
        const downvotes = post.votes.filter(
          (vote) => vote.voteType === "Downvote",
        ).length;

        const totalVotes = upvotes - downvotes;

        return {
          id: post.id,
          title: post.title,
          author: post.memberPostedBy.user.username,
          commentsCount: post.comments.length,
          votes: totalVotes,
          daysAgo: Math.floor(
            (Date.now() - post.dateCreated.getTime()) / (1000 * 60 * 60 * 24),
          ),
        };
      });

      res.json(formattedPosts);
    } catch (error) {
      res.status(500).json({ error: "Error fetching posts" });
    }
  },

  async createPost(req: Request, res: Response) {
    try {
      const { title, memberId, content, postType } = req.body;

      const post = await prisma.post.create({
        data: {
          title,
          memberId,
          content,
          postType,
        },
        include: {
          memberPostedBy: true,
        },
      });

      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Error creating post" });
    }
  },

  async vote(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const { memberId, voteType } = req.body;

      // Check if a user has already voted on this post
      const existingVote = await prisma.vote.findFirst({
        where: {
          postId: parseInt(postId),
          memberId: memberId,
        },
      });

      if (existingVote) {
        // If vote type is the same, remove the vote
        if (existingVote.voteType === voteType) {
          await prisma.vote.delete({
            where: { id: existingVote.id },
          });

          res.json({ message: "Vote removed" });
          return;
        }

        // If a vote type is different, update the vote
        const updatedVote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { voteType },
        });

        res.json(updatedVote);
        return;
      }

      // Create a new vote if none exists
      const vote = await prisma.vote.create({
        data: {
          postId: parseInt(postId),
          memberId,
          voteType,
        },
      });

      res.json(vote);
    } catch (error) {
      res.status(500).json({ error: "Error processing vote" });
    }
  },

  async getPostVotes(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      const votes = await prisma.vote.findMany({
        where: {
          postId: parseInt(postId),
        },
      });

      const totalVotes = votes.reduce(
        (acc, vote) => acc + (vote.voteType === "Upvote" ? 1 : -1),
        0,
      );

      res.json({
        totalVotes,
        upvotes: votes.filter((v) => v.voteType === "Upvote").length,
        downvotes: votes.filter((v) => v.voteType === "Downvote").length,
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching votes" });
    }
  },
};

export default postController;
