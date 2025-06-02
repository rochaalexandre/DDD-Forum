import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../prisma-client";
import bcrypt from "bcrypt";

const UserRequestSchema = z.object({
  email: z.string().email().nonempty(),
  username: z.string().nonempty(),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
});

type UserDto = z.infer<typeof UserRequestSchema> & { memberId?: string };

enum Errors {
  UsernameAlreadyTaken = "UserNameAlreadyTaken",
  EmailAlreadyInUse = "EmailAlreadyInUse",
  ValidationError = "ValidationError",
  ServerError = "ServerError",
  UserNotFound = "UserNotFound",
}

interface UserResponse {
  error?: Errors | undefined;
  success: boolean;
  data?: UserDto;
}

class UserController {
  validationError = {
    error: Errors.ValidationError,
    data: undefined,
    success: false,
  };

  public addUser = async (req: Request, res: Response) => {
    try {
      let result = UserRequestSchema.safeParse(req.body);
      if (result.error) {
        this.returnGenericValidationError(res);
        return;
      }

      const error = await this.validateUniqueEmailAndUserName(result.data);

      if (error) {
        return res.status(400).send({ error });
      }

      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create user and member in a transaction to ensure both are created or none
      const { password, ...userRecord } = await prisma.$transaction(
        async (prismaClient) => {
          // Create the user
          const newUser = await prismaClient.user.create({
            data: {
              ...result.data,
              password: hashedPassword,
            },
          });

          // Create a member record for this user
          const newMember = await prismaClient.member.create({
            data: {
              userId: newUser.d,
            },
          });

          // Return the user with the member ID
          return {
            ...newUser,
            memberId: newMember.d,
          };
        },
      );

      res
        .status(201)
        .json({ data: { ...userRecord }, success: true, error: undefined });
      return;
    } catch (e) {
      console.error("Error creating user:", e);
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
      return;
    }
  };

  public editUser = async (req: Request, res: Response) => {
    try {
      console.log("EDIT USer called");

      const userId = Number(req.params.userId);
      let result = UserRequestSchema.safeParse(req.body);
      if (result.error) {
        this.returnGenericValidationError(res);
        return;
      }

      const userNotFoundError = await this.validateIfUserExists({ id: userId });

      if (userNotFoundError) {
        return res
          .status(400)
          .send({ error: userNotFoundError, success: false, data: undefined });
      }

      const error = await this.validateUniqueEmailAndUserName(
        result.data,
        userId,
      );

      if (error) {
        return res.status(400).send({ error });
      }

      const { password, ...updateUser } = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...result.data,
        },
      });

      res
        .status(200)
        .json({ data: updateUser, success: true, error: undefined });
      return;
    } catch (e) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
      return;
    }
  };

  private async validateIfUserExists(
    where: Record<string, number | string>,
  ): Promise<UserResponse | null> {
    const userSaved = await prisma.user.findFirst({
      where,
    });

    if (!userSaved) {
      return {
        error: Errors.UserNotFound,
        data: undefined,
        success: false,
      };
    }
    return null;
  }

  public listUsers = async (req: Request, res: Response) => {
    const email = req.query.email as string;
    if (!email) {
      res.status(400).send({
        error: Errors.ValidationError,
        data: undefined,
        success: false,
      });
      return;
    }

    const userRecord = await prisma.user.findFirst({
      where: { email },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        member: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userRecord?.id) {
      res
        .status(400)
        .send({ error: Errors.UserNotFound, data: undefined, success: false });
      return;
    }

    // Include the member ID in the response
    // Create response data without the member property
    const { member, ...responseData } = {
      ...userRecord,
      memberId: userRecord.member?id,
    };

    console.log(responseData);
    res
      .status(200)
      .json({ data: responseData, success: true, error: undefined });
    return;
  };

  private returnGenericValidationError(res: Response) {
    return res.status(400).json(this.validationError);
  }

  private async validateUniqueEmailAndUserName(
    data: UserDto,
    excludeUserId?: number,
  ): Promise<UserResponse | null> {
    const emailAlreadyInUsed = await prisma.user.findFirst({
      where: {
        email: data.email,
        ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
      },
      select: { id: true },
    });

    if (emailAlreadyInUsed?.id) {
      return {
        data: undefined,
        success: false,
        error: Errors.EmailAlreadyInUse,
      };
    }

    const userNameAlreadyInUsed = await prisma.user.findFirst({
      where: {
        username: data.username,
        ...(excludeUserId ? { NOT: { id: excludeUserId } } : {}),
      },
      select: { id: true },
    });

    if (userNameAlreadyInUsed?.id) {
      return {
        data: undefined,
        success: false,
        error: Errors.UsernameAlreadyTaken,
      };
    }

    return null;
  }
}

export default new UserController();
