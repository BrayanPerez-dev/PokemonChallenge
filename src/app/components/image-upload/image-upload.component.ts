import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ImgbbService } from '../../services/Imgbb/imgbb.service';
import { IImgBBResponse } from '../../interfaces/IImages';
import { UserInfoService } from '../../services/UserInfo/user-info.service';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUploadComponent {
  isDragOver = false;
  isUploading = false;
  uploadedFileName: string = '';
  errorMessage = '';
  private imgbbService$ = inject(ImgbbService);
  private userService = inject(UserInfoService);
  @Output() uploadedImageUrl: EventEmitter<string> = new EventEmitter<string>();

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Por favor selecciona un archivo de imagen válido.';
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      this.errorMessage = 'El archivo es demasiado grande. Máximo 1MB.';
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    this.uploadedImageUrl.emit('');
    this.uploadedFileName = '';

    this.imgbbService$.uploadImage(file).subscribe({
      next: (response: IImgBBResponse) => {
        this.isUploading = false;
        if (response.success) {
          this.uploadedFileName = file.name;
          this.uploadedImageUrl.emit(response.data.display_url);
          this.userService.setUserPhoto(response.data.display_url);
        } else {
          this.errorMessage = 'Error al subir la imagen.';
        }
      },
      error: (error) => {
        this.isUploading = false;
        console.error('Error uploading image:', error);
        this.errorMessage = 'Error al subir la imagen. Verifica tu API key.';
      },
    });
  }

  deleteImage() {
    this.uploadedFileName = '';
    this.uploadedImageUrl.emit('');
  }
}
