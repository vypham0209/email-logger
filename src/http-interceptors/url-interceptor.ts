import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http'
import { inject } from '@angular/core'

import { Observable } from 'rxjs'
import { ConfigService } from '../services/config.service'

export function urlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const API_HOST = inject(ConfigService).API_HOST
  const API_CONTEXT = inject(ConfigService).API_CONTEXT

  const reqWithURL = req.clone({
    url: `${API_HOST}${API_CONTEXT}${req.url}`
  })
  return next(reqWithURL)
}