import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import {
  GeneralResponse,
  commonResponse,
} from '../../utilities/CommonResponse';
import { VolunteerRequest } from '../../models/volunteer_request';
import { Users } from '../../models/users';
import { volunteerRequestMapper } from '../../mappers/VolunteerRequestMapper';
import { EmailUtils } from '../../utilities/EmailUtils';
dotenv.config();
const secretKey = process.env.SECRETKEY as string;

export const listRequestVolunteers = async (
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

    const organizerId = decodedToken.id;
    const organizer = await Users.findOne({
      where: {
        id: organizerId,
        role_id: 2,
      },
    });

    if (organizer && organizer.organization_id) {
      const requestVolunteersCurrent = await VolunteerRequest.findAll({
        where: { organization_id: organizer?.organization_id },
      });
      const requestVolunteers = await volunteerRequestMapper(
        requestVolunteersCurrent,
      );

      if (requestVolunteers.length > 0) {
        const response: GeneralResponse<{
          requestVolunteers: any[];
        }> = {
          status: 200,
          data: { requestVolunteers },
          message: 'Lấy danh sách yêu cầu thành công',
        };
        commonResponse(req, res, response);
      } else {
        const response: GeneralResponse<{}> = {
          status: 200,
          data: [],
          message: 'Không có yêu cầu nào',
        };
        commonResponse(req, res, response);
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

export const updateRequestVolunteer = async (
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

    const organizerId = decodedToken.id;
    const organizer = await Users.findOne({
      where: {
        id: organizerId,
        role_id: 2,
      },
    });
    if (organizer) {
      const volunteerId = req.body.user_id as number;
      const checkStatus = req.body.status as number;
      if (checkStatus === 0) {
        const body = { status: 0, updated_at: new Date() };
        const volunteerRequestRecord = await VolunteerRequest.findOne({
          where: { user_id: volunteerId },
        });
        if (volunteerRequestRecord) {
          const result = await volunteerRequestRecord.update(body);
          const accountUser = await Users.findByPk(
            volunteerRequestRecord.user_id,
          );
          if (result && accountUser) {
            const resultTwo = await accountUser.update({
              organization_id: organizer.organization_id,
              updated_at: new Date(),
            });
            if (resultTwo) {
              const emailUtils = new EmailUtils();
              

              const response: GeneralResponse<{}> = {
                status: 200,
                data: null,
                message: `Duyệt thành công cho thành viên ${req.body.user_id}`,
              };
              commonResponse(req, res, response);
            }
          }
        }
      } else {
        const body = {
          user_id: volunteerId,
          organization_id: organizer.organization_id,
          status: 2,
          updated_at: new Date(),
        };
        const volunteerRequestRecord = await VolunteerRequest.findOne({
          where: {
            user_id: volunteerId,
            organization_id: organizer.organization_id,
          },
        });
        if (volunteerRequestRecord) {
          const result = await volunteerRequestRecord.update(body);
          if (result) {
            const response: GeneralResponse<{}> = {
              status: 200,
              data: null,
              message: `Không duyệt cho thành viên ${req.body.user_id}`,
            };
            commonResponse(req, res, response);
          }
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
