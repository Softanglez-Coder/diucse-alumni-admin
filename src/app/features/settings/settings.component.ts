import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SettingsService, Setting } from './settings.service';
import { Subscription } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Settings Management</h1>
        <button
          pButton
          label="Add Setting"
          icon="pi pi-plus"
          class="p-button-primary"
          (click)="showDialog()"
        ></button>
      </div>

      <!-- Settings Table -->
      <p-card>
        <ng-template pTemplate="content">
          <p-table
            [value]="settings"
            [loading]="loading"
            responsiveLayout="scroll"
            [paginator]="true"
            [rows]="10"
            [rowsPerPageOptions]="[10, 25, 50]"
            [globalFilterFields]="['group', 'key', 'description']"
            #dt
          >
            <ng-template pTemplate="caption">
              <div class="flex">
                <span class="p-input-icon-left ml-auto">
                  <i class="pi pi-search"></i>
                  <input
                    pInputText
                    type="text"
                    (input)="dt.filterGlobal($any($event.target).value, 'contains')"
                    placeholder="Search settings..."
                  />
                </span>
              </div>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th pSortableColumn="group">
                  Group
                  <p-sortIcon field="group"></p-sortIcon>
                </th>
                <th pSortableColumn="key">
                  Key
                  <p-sortIcon field="key"></p-sortIcon>
                </th>
                <th>Description</th>
                <th>Value</th>
                <th pSortableColumn="createdAt">
                  Created At
                  <p-sortIcon field="createdAt"></p-sortIcon>
                </th>
                <th style="width: 120px">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-setting>
              <tr>
                <td>
                  <p-tag
                    [value]="setting.group"
                    [style]="getGroupTagStyle(setting.group)"
                  ></p-tag>
                </td>
                <td>{{ setting.key }}</td>
                <td>{{ setting.description }}</td>
                <td>
                  <span [ngClass]="getValueClass(setting.value)">
                    {{ formatValue(setting.value) }}
                  </span>
                </td>
                <td>{{ setting.createdAt | date:'short' }}</td>
                <td>
                  <div class="flex gap-2">
                    <button
                      pButton
                      icon="pi pi-pencil"
                      class="p-button-sm p-button-text p-button-warning"
                      (click)="editSetting(setting)"
                      title="Edit"
                    ></button>
                    <button
                      pButton
                      icon="pi pi-trash"
                      class="p-button-sm p-button-text p-button-danger"
                      (click)="confirmDelete(setting)"
                      title="Delete"
                    ></button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center py-8">
                  <i class="pi pi-info-circle text-4xl text-gray-400 mb-4 block"></i>
                  <p class="text-gray-500">No settings found</p>
                  <button
                    pButton
                    label="Add First Setting"
                    icon="pi pi-plus"
                    class="p-button-text mt-2"
                    (click)="showDialog()"
                  ></button>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-template>
      </p-card>

      <!-- Add/Edit Dialog -->
      <p-dialog
        [(visible)]="displayDialog"
        [header]="editMode ? 'Edit Setting' : 'Add Setting'"
        [modal]="true"
        [style]="{width: '600px'}"
        [closable]="true"
      >
        <form [formGroup]="settingForm" (ngSubmit)="saveSetting()">
          <div class="grid grid-cols-2 gap-4">
            <div class="field">
              <label for="group" class="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <input
                id="group"
                type="text"
                pInputText
                formControlName="group"
                placeholder="e.g., membership, general, system"
                [style]="{'width': '100%'}"
              />
              <small class="p-error" *ngIf="settingForm.get('group')?.invalid && settingForm.get('group')?.touched">
                Group is required
              </small>
            </div>

            <div class="field">
              <label for="key" class="block text-sm font-medium text-gray-700 mb-2">Key</label>
              <input
                id="key"
                type="text"
                pInputText
                formControlName="key"
                placeholder="e.g., membership_fee, max_users"
                [style]="{'width': '100%'}"
                [readonly]="editMode"
              />
              <small class="p-error" *ngIf="settingForm.get('key')?.invalid && settingForm.get('key')?.touched">
                Key is required
              </small>
            </div>
          </div>

          <div class="field mt-4">
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              [style]="{'width': '100%'}"
              placeholder="Describe what this setting controls"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            <small class="p-error" *ngIf="settingForm.get('description')?.invalid && settingForm.get('description')?.touched">
              Description is required
            </small>
          </div>

          <div class="field mt-4">
            <label for="valueType" class="block text-sm font-medium text-gray-700 mb-2">Value Type</label>
            <select
              id="valueType"
              formControlName="valueType"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              (change)="onValueTypeChange()"
            >
              <option value="number">Number</option>
              <option value="string">Text</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>

          <div class="field mt-4">
            <label for="value" class="block text-sm font-medium text-gray-700 mb-2">Value</label>

            <!-- Number input -->
            <p-inputNumber
              *ngIf="settingForm.get('valueType')?.value === 'number'"
              id="value"
              formControlName="value"
              [style]="{'width': '100%'}"
              placeholder="Enter numeric value"
            ></p-inputNumber>

            <!-- Text input -->
            <input
              *ngIf="settingForm.get('valueType')?.value === 'string'"
              id="value"
              type="text"
              pInputText
              formControlName="value"
              placeholder="Enter text value"
              [style]="{'width': '100%'}"
            />

            <!-- Boolean input -->
            <select
              *ngIf="settingForm.get('valueType')?.value === 'boolean'"
              id="value"
              formControlName="value"
              class="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>

            <small class="p-error" *ngIf="settingForm.get('value')?.invalid && settingForm.get('value')?.touched">
              Value is required
            </small>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button
              type="button"
              pButton
              label="Cancel"
              class="p-button-text"
              (click)="hideDialog()"
            ></button>
            <button
              type="submit"
              pButton
              [label]="editMode ? 'Update' : 'Save'"
              [disabled]="settingForm.invalid || saving"
              [loading]="saving"
            ></button>
          </div>
        </form>
      </p-dialog>

      <p-toast></p-toast>
      <p-confirmDialog></p-confirmDialog>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-card-content {
      padding: 1.5rem;
    }

    :host ::ng-deep .p-table th {
      background-color: #f8fafc;
      font-weight: 600;
    }

    .field label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .p-error {
      color: #e24c4c;
      font-size: 0.875rem;
    }

    :host ::ng-deep .p-tag {
      font-size: 0.75rem;
      font-weight: 600;
    }
  `]
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: Setting[] = [];
  displayDialog = false;
  editMode = false;
  loading = false;
  saving = false;
  selectedSetting: Setting | null = null;
  private subscriptions: Subscription[] = [];

  settingForm: FormGroup;

  constructor(
    private settingsService: SettingsService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef
  ) {
    this.settingForm = this.fb.group({
      group: ['', Validators.required],
      key: ['', Validators.required],
      description: ['', Validators.required],
      valueType: ['number', Validators.required],
      value: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadSettings() {
    this.loading = true;
    console.log('Loading settings...');

    const subscription = this.settingsService.getAllSettings()
      .pipe(
        timeout(8000), // 8 second timeout
        catchError(error => {
          console.error('Settings API error:', error);

          // Show appropriate error message based on error type
          if (error.name === 'TimeoutError') {
            this.messageService.add({
              severity: 'error',
              summary: 'Connection Timeout',
              detail: 'Unable to connect to the server. Please check your connection.'
            });
          } else if (error.status === 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Network Error',
              detail: 'Cannot reach the server. Please check if the backend is running.'
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: `Failed to load settings: ${error.message || 'Unknown error'}`
            });
          }

          // Return empty array on error instead of throwing
          return of([]);
        })
      )
      .subscribe({
        next: (settings: Setting[]) => {
          console.log('Settings loaded successfully:', settings);
          this.settings = settings;
          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
        },
        error: (error: any) => {
          console.error('Error loading settings after operators:', error);
          this.loading = false;
          this.cdr.detectChanges(); // Force change detection
        },
        complete: () => {
          console.log('Settings loading completed');
          // Ensure loading is always false when observable completes
          if (this.loading) {
            this.loading = false;
            this.cdr.detectChanges(); // Force change detection
          }
        }
      });

    this.subscriptions.push(subscription);
  }

  showDialog() {
    this.editMode = false;
    this.selectedSetting = null;
    this.settingForm.reset();
    this.settingForm.patchValue({ valueType: 'number' });
    this.displayDialog = true;
  }

  editSetting(setting: Setting) {
    this.editMode = true;
    this.selectedSetting = setting;

    // Determine value type
    let valueType = 'string';
    if (typeof setting.value === 'number') {
      valueType = 'number';
    } else if (typeof setting.value === 'boolean') {
      valueType = 'boolean';
    }

    this.settingForm.patchValue({
      group: setting.group,
      key: setting.key,
      description: setting.description,
      valueType: valueType,
      value: setting.value
    });
    this.displayDialog = true;
  }

  hideDialog() {
    this.displayDialog = false;
    this.settingForm.reset();
    this.selectedSetting = null;
  }

  onValueTypeChange() {
    const valueType = this.settingForm.get('valueType')?.value;
    const valueControl = this.settingForm.get('value');

    // Reset value when type changes
    valueControl?.setValue(null);

    // Update validators based on type
    if (valueType === 'number') {
      valueControl?.setValidators([Validators.required]);
    } else if (valueType === 'boolean') {
      valueControl?.setValue('true');
    } else {
      valueControl?.setValidators([Validators.required]);
    }
    valueControl?.updateValueAndValidity();
  }

  saveSetting() {
    if (this.settingForm.invalid) {
      return;
    }

    this.saving = true;
    const formValue = this.settingForm.value;

    // Convert value based on type
    let processedValue = formValue.value;
    if (formValue.valueType === 'number') {
      processedValue = Number(formValue.value);
    } else if (formValue.valueType === 'boolean') {
      processedValue = formValue.value === 'true';
    }

    const settingData = {
      group: formValue.group,
      key: formValue.key,
      description: formValue.description,
      value: processedValue
    };

    const operation = this.editMode && this.selectedSetting
      ? this.settingsService.updateSetting(this.selectedSetting._id, settingData)
      : this.settingsService.createSetting(settingData);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Setting ${this.editMode ? 'updated' : 'created'} successfully`
        });
        this.hideDialog();
        this.loadSettings();
        this.saving = false;
      },
      error: (error: any) => {
        console.error('Error saving setting:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${this.editMode ? 'update' : 'create'} setting`
        });
        this.saving = false;
      }
    });
  }

  confirmDelete(setting: Setting) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the setting "${setting.key}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSetting(setting);
      }
    });
  }

  deleteSetting(setting: Setting) {
    this.settingsService.deleteSetting(setting._id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Setting deleted successfully'
        });
        this.loadSettings();
      },
      error: (error: any) => {
        console.error('Error deleting setting:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete setting'
        });
      }
    });
  }

  getGroupTagStyle(group: string): any {
    const styles: any = {
      'membership': { background: '#10b981', color: 'white' },
      'general': { background: '#3b82f6', color: 'white' },
      'system': { background: '#8b5cf6', color: 'white' },
      'security': { background: '#ef4444', color: 'white' },
      'notification': { background: '#f59e0b', color: 'white' }
    };
    return styles[group] || { background: '#6b7280', color: 'white' };
  }

  getValueClass(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold';
    }
    if (typeof value === 'number') {
      return 'text-blue-600 font-mono';
    }
    return 'text-gray-800';
  }

  formatValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'True' : 'False';
    }
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return String(value);
  }
}
