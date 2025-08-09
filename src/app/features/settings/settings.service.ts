import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';

export interface Setting {
  _id: string;
  key: string;
  description: string;
  value: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export enum SettingsKey {
  // Membership settings
  MembershipFee = 'membership_fee',
  MembershipDuration = 'membership_duration',
  MaxMembersPerBatch = 'max_members_per_batch',

  // General settings
  SiteName = 'site_name',
  SiteDescription = 'site_description',
  ContactEmail = 'contact_email',

  // System settings
  MaxFileSize = 'max_file_size',
  SessionTimeout = 'session_timeout',
  EnableMaintenance = 'enable_maintenance',

  // Security settings
  PasswordMinLength = 'password_min_length',
  EnableTwoFactor = 'enable_two_factor',
  MaxLoginAttempts = 'max_login_attempts',

  // Notification settings
  EmailNotifications = 'email_notifications',
  PushNotifications = 'push_notifications',
  NotificationFrequency = 'notification_frequency',
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService extends DataService {
  private readonly endpoint = '/settings';

  /**
   * Create a new setting
   */
  createSetting(setting: Partial<Setting>): Observable<Setting> {
    return this.create<Setting>(this.endpoint, setting);
  }

  /**
   * Get all settings
   */
  getAllSettings(): Observable<Setting[]> {
    return this.getAll<Setting>(this.endpoint);
  }

  /**
   * Get setting by ID
   */
  getSettingById(id: string): Observable<Setting> {
    return this.getById<Setting>(this.endpoint, id);
  }

  /**
   * Update a setting
   */
  updateSetting(id: string, setting: Partial<Setting>): Observable<Setting> {
    return this.update<Setting>(this.endpoint, id, setting);
  }

  /**
   * Delete a setting
   */
  deleteSetting(id: string): Observable<void> {
    return this.delete<void>(this.endpoint, id);
  }

  /**
   * Get setting by key
   */
  getSettingByKey(key: SettingsKey): Observable<Setting> {
    return this.apiService.get<Setting>(`${this.endpoint}/keys/${key}`);
  }
}
