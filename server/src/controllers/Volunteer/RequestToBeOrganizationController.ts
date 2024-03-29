import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import {
  GeneralResponse,
  commonResponse,
} from '../../utilities/CommonResponse';
import { Users } from '../../models/users';
import { OrganizationRequest } from '../../models/organization_request';
import { Organization } from '../../models/organization';
import { EmailDetails, EmailUtils } from '../../utilities/EmailUtils';
import { randomId } from '../../utilities/random';
dotenv.config();
const secretKey = process.env.SECRETKEY as string;

export const requestToBeOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = decodedToken.id;
    const user = await Users.findByPk(userId);
    const organization = await Organization.findOne({
      where: { creator: userId },
    });

    if (user) {
      {
        const body = {
          user_id: userId as number,
          organization_id: organization?.id as number,
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const result = await OrganizationRequest.create(body);
        if (result) {
          const emailUtils = new EmailUtils();
          const receiverEmail = user.email as string;
          const emailDetails: EmailDetails = {
            subject: 'Organizer Request Confirmation',
            body: 'Your Organizer request has been successfully submitted.',
          };
          emailUtils.sendEmail(receiverEmail, emailDetails);

          const response: GeneralResponse<{}> = {
            status: 200,
            data: null,
            message: 'Request successfull',
          };
          commonResponse(req, res, response);
        }
      }
    }
  } catch (error: any) {
    console.error(error);
    const response: GeneralResponse<{}> = {
      status: 400,
      data: null,
      message: error.message,
    };
    commonResponse(req, res, response);
  }
};
export const getCurrentRequestTobeOrganization = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = decodedToken.id;

    const currentRequest = await OrganizationRequest.findOne({
      where: {
        user_id: userId,
      },
    });
    if (currentRequest) {
      const response: GeneralResponse<{}> = {
        status: 200,
        data: currentRequest,
        message: 'Lấy request hiện tại thành công',
      };
      commonResponse(req, res, response);
    } else {
      const response: GeneralResponse<{}> = {
        status: 200,
        data: null,
        message: 'Request not found',
      };
      commonResponse(req, res, response);
    }
  } catch (error: any) {
    console.error(error);
    const response: GeneralResponse<{}> = {
      status: 400,
      data: null,
      message: error.message,
    };
    commonResponse(req, res, response);
  }
};

export const cancelRequestTobeOrg = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const decodedToken = jwt.verify(token, secretKey) as jwt.JwtPayload;
    const userId = decodedToken.id;

    const currentRequest = await OrganizationRequest.findOne({
      where: {
        user_id: userId,
      },
    });
    if (currentRequest) {
      await OrganizationRequest.destroy({
        where: {
          user_id: userId,
        },
      });
      const response: GeneralResponse<{}> = {
        status: 200,
        data: currentRequest,
        message: 'Lấy request hiện tại thành công',
      };
      commonResponse(req, res, response);
    } else {
      const response: GeneralResponse<{}> = {
        status: 200,
        data: null,
        message: 'Request not found',
      };
      commonResponse(req, res, response);
    }
  } catch (error: any) {
    console.error(error);
    const response: GeneralResponse<{}> = {
      status: 400,
      data: null,
      message: error.message,
    };
    commonResponse(req, res, response);
  }
};
