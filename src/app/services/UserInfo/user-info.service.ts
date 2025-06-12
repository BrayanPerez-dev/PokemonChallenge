import { Injectable } from '@angular/core';
import { IUser } from '../../interfaces/IUser';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  
  private userSubject = new BehaviorSubject<IUser | null>(
    this.getFromStorage()
  );

  private userPhoto = new BehaviorSubject<string | null>(null);
  user$ = this.userSubject.asObservable();
  userPhoto$ = this.userPhoto.asObservable();
  private STORAGE_KEY = 'trainer_info';

  constructor() {
    const userFromStorage = this.getFromStorage();
    if (userFromStorage) {
      this.userSubject.next(userFromStorage);
    }
  }
  setUser(user: IUser): Observable<string> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.userSubject.next(user);
    return of('User information saved successfully').pipe(delay(500));
  }

  setUserPhoto(photo: string): void {
    this.userPhoto.next(photo);
  }

  getUserPhoto(): string | null {
    const currentPhoto = this.userPhoto.getValue();
    if (currentPhoto) {
      return currentPhoto;
    }
    return null;
  }

  getUser(): IUser | null {
    return this.userSubject.getValue() || this.getFromStorage();
  }

  clearUser(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.userSubject.next(null);
  }

  private getFromStorage(): IUser | null {
    const user = localStorage.getItem(this.STORAGE_KEY);
    return user ? JSON.parse(user) : null;
  }
}
