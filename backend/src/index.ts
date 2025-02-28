import express from "express";
import cors from "cors";

import userController from "./controller/user-controller";

const app = express();
const router = express.Router();
app.use(express.json());
app.use(cors());

// Create a new user
app.post("/users/new", userController.addUser);

// Edit a user
app.post("/users/edit/:userId", userController.editUser);

// Get a user by email
app.get("/users", userController.listUsers);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
