import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { of } from 'rxjs';

describe('AuthService - Role-Based Access Control', () => {
  let service: AuthService;
  let mockAuth0Service: jasmine.SpyObj<Auth0Service>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const auth0Spy = jasmine.createSpyObj('Auth0Service', [
      'loginWithRedirect',
      'logout',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Auth0Service, useValue: auth0Spy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    mockAuth0Service = TestBed.inject(Auth0Service) as jasmine.SpyObj<Auth0Service>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasAdminAccess', () => {
    it('should return true for user with Admin role', () => {
      // Set a user with Admin role
      service['currentUserSubject'].next({
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['Admin'],
      });

      expect(service.hasAdminAccess()).toBe(true);
    });

    it('should return true for user with Publisher role', () => {
      service['currentUserSubject'].next({
        id: '2',
        email: 'publisher@example.com',
        name: 'Publisher User',
        roles: ['Publisher'],
      });

      expect(service.hasAdminAccess()).toBe(true);
    });

    it('should return true for user with Editor role', () => {
      service['currentUserSubject'].next({
        id: '3',
        email: 'editor@example.com',
        name: 'Editor User',
        roles: ['Editor'],
      });

      expect(service.hasAdminAccess()).toBe(true);
    });

    it('should return false for user with only Member role', () => {
      service['currentUserSubject'].next({
        id: '4',
        email: 'member@example.com',
        name: 'Member User',
        roles: ['Member'],
      });

      expect(service.hasAdminAccess()).toBe(false);
    });

    it('should return false for user with only Guest role', () => {
      service['currentUserSubject'].next({
        id: '5',
        email: 'guest@example.com',
        name: 'Guest User',
        roles: ['Guest'],
      });

      expect(service.hasAdminAccess()).toBe(false);
    });

    it('should return false for user with both Member and Guest roles', () => {
      service['currentUserSubject'].next({
        id: '6',
        email: 'membguest@example.com',
        name: 'Member Guest User',
        roles: ['Member', 'Guest'],
      });

      expect(service.hasAdminAccess()).toBe(false);
    });

    it('should return true for user with Member and Admin roles', () => {
      service['currentUserSubject'].next({
        id: '7',
        email: 'memberadmin@example.com',
        name: 'Member Admin User',
        roles: ['Member', 'Admin'],
      });

      expect(service.hasAdminAccess()).toBe(true);
    });

    it('should return true for user with Guest and Publisher roles', () => {
      service['currentUserSubject'].next({
        id: '8',
        email: 'guestpub@example.com',
        name: 'Guest Publisher User',
        roles: ['Guest', 'Publisher'],
      });

      expect(service.hasAdminAccess()).toBe(true);
    });

    it('should return false for user with no roles', () => {
      service['currentUserSubject'].next({
        id: '9',
        email: 'noroles@example.com',
        name: 'No Roles User',
        roles: [],
      });

      expect(service.hasAdminAccess()).toBe(false);
    });

    it('should return false for null user', () => {
      service['currentUserSubject'].next(null);

      expect(service.hasAdminAccess()).toBe(false);
    });

    it('should be case-insensitive for role names', () => {
      service['currentUserSubject'].next({
        id: '10',
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['admin'], // lowercase
      });

      expect(service.hasAdminAccess()).toBe(true);

      service['currentUserSubject'].next({
        id: '11',
        email: 'member@example.com',
        name: 'Member User',
        roles: ['MEMBER'], // uppercase
      });

      expect(service.hasAdminAccess()).toBe(false);
    });
  });

  describe('login', () => {
    it('should store returnUrl in localStorage and call Auth0 login', () => {
      spyOn(localStorage, 'setItem');

      service.login('/apps/users');

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_return_url',
        '/apps/users'
      );
      expect(mockAuth0Service.loginWithRedirect).toHaveBeenCalled();
    });

    it('should call Auth0 login without storing returnUrl if not provided', () => {
      spyOn(localStorage, 'setItem');

      service.login();

      expect(localStorage.setItem).not.toHaveBeenCalled();
      expect(mockAuth0Service.loginWithRedirect).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear user data and call Auth0 logout', () => {
      spyOn(localStorage, 'removeItem');

      service['currentUserSubject'].next({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['Admin'],
      });

      service.logout();

      expect(service.getCurrentUser()).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_return_url');
      expect(mockAuth0Service.logout).toHaveBeenCalled();
    });
  });
});
