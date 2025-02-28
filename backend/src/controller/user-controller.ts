import { Request, Response } from "express";
import { z } from "zod";

const userRequestSchema = z.object({
  email: z.string().email().nonempty(),
  username: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
});

const Errors = {
  UsernameAlreadyTaken: "UserNameAlreadyTaken",
  EmailAlreadyInUse: "EmailAlreadyInUse",
  ValidationError: "ValidationError",
  ServerError: "ServerError",
  ClientError: "ClientError",
  UserNotFound: "UserNotFound",
};

interface UserResponse {
  error: typeof Errors;
  success: boolean;
  data: any;
}

class UserController {
  validationError = {
    error: Errors.ValidationError,
    data: undefined,
    success: false,
  };

  public addUser = async (req: Request, res: Response) => {
    let result = userRequestSchema.safeParse(req.body);
    if (result.error) {
      this.returnGenericValidationError(res);
    } else {
      console.log(result.data);
      res.status(201).json({ data: result.data, success: true });
    }
    return;
  };

  public editUser = async (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      this.returnGenericValidationError(res);
      return;
    }

    let result = userRequestSchema.safeParse(req.body);
    if (result.error) {
      res.status(400).send({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
    } else {
      console.log(result.data);
      res
        .status(20!)
        .send({ error: undefined, data: result.data, success: true });
    }
    return;
  };

  public listUsers = async (req: Request, res: Response) => {
    const { userEmail } = req.query;
    if (!userEmail) {
      res
        .status(400)
        .send({ error: Errors.UserNotFound, data: undefined, success: false });
    }
    return;
  };

  private returnGenericValidationError(res: Response) {
    return res.status(400).json(this.validationError);
  }
}

export default new UserController();
