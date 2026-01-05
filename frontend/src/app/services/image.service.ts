import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    return new Observable((observer) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        });

        this.http
          .post(
            `${this.apiUrl}/rpc/upload_file`,
            {
              base64_data: base64,
              file_type: file.type,
              file_name: file.name,
            },
            { headers }
          )
          .subscribe({
            next: (response: any) => {
              const fileId = response.id;
              const fileUrl = `${this.apiUrl}/rpc/file?file_id=${fileId}`;
              observer.next({ id: fileId, url: fileUrl });
              observer.complete();
            },
            error: (error) => observer.error(error),
          });
      };

      reader.onerror = (error) => observer.error(error);
      reader.readAsDataURL(file);
    });
  }
}
