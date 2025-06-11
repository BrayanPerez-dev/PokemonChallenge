import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IImgBBResponse } from '../../interfaces/IImages';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ImgbbService {
  

  private http = inject(HttpClient);

  uploadImage(file: File): Observable<IImgBBResponse> {
    const formData = new FormData();
    formData.append('key', environment.API_KEY_IMGBB);
    formData.append('image', file);

    return this.http.post<IImgBBResponse>(environment.API_URL_IMGBB, formData);
  }
}

