import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../environments/environment'

@Injectable({ providedIn: 'root' })
export abstract class BaseApiService {
  protected http = inject(HttpClient)
  protected baseUrl = environment.apiUrl

  protected post<T, R>(endpoint: string, body: T): Observable<R> {
    return this.http.post<R>(`${this.baseUrl}${endpoint}`, body)
  }

  protected get<R>(endpoint: string, options: Record<string, unknown> = {}): Observable<R> {
    return this.http.get<R>(`${this.baseUrl}${endpoint}`, options)
  }
}
