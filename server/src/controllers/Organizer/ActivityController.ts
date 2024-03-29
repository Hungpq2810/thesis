import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import {
  GeneralResponse,
  commonResponse,
} from '../../utilities/CommonResponse';
import { Users } from '../../models/users';
import { Activities, ActivityAttributes } from '../../models/activities';
import { SkillActivities } from '../../models/skill_activities';
import { register } from '../AuthController';

dotenv.config();
const secretKey = process.env.SECRETKEY as string;

export const createActivity = async (
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
      where: { id: organizerId, role_id: 2 },
    });

    const org_id = organizer?.organization_id;

    if (organizer) {
      const body = {
        creator: organizerId as number,
        name: req.body.name as string,
        description: req.body.description as string,
        location: req.body.location as string,
        num_of_accepted: 0,
        max_of_volunteers: req.body.max_of_volunteers,
        image: req.body.image as string,
        register_from: req.body.register_from,
        register_to: req.body.register_to,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        status: req.body.status,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // body.status = new Date() > req.body.register_to ? 1 : 0;
      const result = await Activities.create(body);

      if (result) {
        const skillsActivity = req.body.skillsActivity;
        try {
          const skillActivitiesPromises = skillsActivity.map(
            async (skill: number) => {
              const bodySkillActivities = {
                activity_id: result.id,
                skill_id: skill,
                created_at: new Date(),
                updated_at: new Date(),
              };
              return await SkillActivities.create(bodySkillActivities);
            },
          );
          await Promise.all(skillActivitiesPromises);
        } catch (error) {
          console.error(error);
        }
        const response: GeneralResponse<{}> = {
          status: 200,
          data: result,
          message: 'Tạo thành công sự kiện',
        };
        commonResponse(req, res, response);
      }
    }
  } catch (error) {}
};
export const updateActivity = async (
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
      where: { id: organizerId, role_id: 2 },
    });

    if (organizer) {
      const activityId = req.params.id;

      const activity = await Activities.findByPk(activityId);
      if (activity && activity.creator === organizerId) {
        const updatedActivity = {
          // creator: organizerId as number,
          name: req.body.name as string,
          description: req.body.description as string,
          location: req.body.location as string,
          max_of_volunteers: req.body.max_of_volunteers,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          image: req.body.image as string,
          status: req.body.status,
          register_from: req.body.register_from,
          register_to: req.body.register_to,
          updated_at: new Date(),
        };

        // const today = new Date();

        // if (today > new Date(updatedActivity.register_to))
        //   updatedActivity.status = 1;
        // else {
        //   updatedActivity.status = 0;
        // }

        await Activities.update(updatedActivity, {
          where: { id: activityId },
        });

        await SkillActivities.destroy({
          where: {
            activity_id: activityId,
          },
        });
        const skillsActivity = req.body.skillsActivity;
        const skillActivitiesPromises = skillsActivity.map(
          async (skill: number) => {
            const bodySkillActivities = {
              activity_id: Number(activityId),
              skill_id: skill,
              created_at: new Date(),
              updated_at: new Date(),
            };
            return await SkillActivities.create(bodySkillActivities);
          },
        );
        await Promise.all(skillActivitiesPromises);
        const response: GeneralResponse<{}> = {
          status: 200,
          data: null,
          message: 'Cập nhật thành công',
        };
        commonResponse(req, res, response);
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    }
  } catch (error) {
    console.error(error);
    const response: GeneralResponse<{}> = {
      status: 400,
      data: null,
      message: 'Xảy ra lỗi khi cập nhật',
    };
    commonResponse(req, res, response);
  }
};
export const deleteActivity = async (
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
      where: { id: organizerId, role_id: 2 },
    });

    if (organizer) {
      const activityId = req.params.id;
      const activity = await Activities.findByPk(activityId);

      if (activity && activity.creator === organizerId) {
        await Activities.destroy({
          where: { id: activityId },
        });

        const response: GeneralResponse<{}> = {
          status: 200,
          data: null,
          message: 'Xóa hoạt động thành công',
        };
        commonResponse(req, res, response);
      } else {
        res.status(403).json({ message: 'Forbidden' });
      }
    }
  } catch (error) {
    console.error(error);
    const response: GeneralResponse<{}> = {
      status: 400,
      data: null,
      message: 'Xảy ra lỗi khi xóa hoạt động',
    };
    commonResponse(req, res, response);
  }
};
