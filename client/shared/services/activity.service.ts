import { AxiosResponse } from 'axios';
import { https, httpsNoToken } from '../config/https.config';
import { IBaseResponse } from '@/typeDefs/baseReponse.type';
import {
  IActivity,
  IActivityList,
  IAppliedVolunteers
} from '@/typeDefs/schema/activity.type';

class ActivityService {
  getAllActivity(): Promise<AxiosResponse<IBaseResponse<IActivityList>>> {
    return httpsNoToken.get('/activities');
  }
  searchActivity(
    key: string
  ): Promise<AxiosResponse<IBaseResponse<IActivityList>>> {
    return httpsNoToken.get(`/search_activities?key=${key}`);
  }

  searchMultipleActivity(body: {
    name?: string;
    address?: string;
    skills?: number[];
    orgainzer?: number;
  }): Promise<AxiosResponse<IBaseResponse<IActivityList>>> {
    return httpsNoToken.get(`/search_multiple_activities`, {params: body});
  }

  applyActivity(body: { activity_id: number }) {
    return https.post('/apply_volunteer', body);
  }
  cancelActivity(body: { activity_id: number }) {
    return https.post('/cancel_volunteer', body);
  }
  getActivityById(
    id: number
  ): Promise<AxiosResponse<IBaseResponse<IActivity>>> {
    return httpsNoToken.get(`/activities/${id}`);
  }
  newActivity(body: {
    name: string;
    description: string;
    location: string;
    skillsActivity: string[];
  }) {
    return https.post('/organizer/create_activity', body);
  }
  updateActivity(
    id: number,
    body: {
      name: string;
      description: string;
      location: string;
      skillsActivity: string[];
    }
  ) {
    return https.put(`/organizer/update_activity/${id}`, body);
  }
  deleteActivity(id: number) {
    return https.delete(`/admin/activity/${id}`);
  }
  getAllApplyActivity(): Promise<
    AxiosResponse<IBaseResponse<IAppliedVolunteers>>
  > {
    return https.get('/organizer/applied_volunteer');
  }
  updateApplyActivity(body: { user_id: number; status: number }) {
    return https.put(`/organizer/update_applied_volunteer`, body);
  }
}

export const activityService = new ActivityService();
