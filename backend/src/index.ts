import express from "express";
import cors from "cors";

import userController from "./controller/user-controller";
import postController from "./controller/post-controller";
import { checkAndPrepareDatabaseAsync } from "./database-seeder";

const app = express();
app.use(express.json());
app.use(cors());

// User routes
app.post("/users/new", userController.addUser);
app.post("/users/edit/:userId", userController.editUser);
app.get("/users", userController.listUsers);

// Post routes
app.get("/posts", postController.listPosts);
app.post("/posts/new", postController.createPost);
app.post("/posts/:postId/vote", postController.vote);

const port = process.env.PORT || 3030;

// First seed the database, then start the server
checkAndPrepareDatabaseAsync()
  .then(() =>
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    }),
  )
  .catch((error) => {
    console.error("Failed to start application:", error);
    process.exit(1);
  });
