import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ConfigService {
  get API_HOST() {
    return this.API_HOST$.value
  }
  set API_HOST(value: string) {
    this.API_HOST$.next(value)
  }
  API_HOST$ = new BehaviorSubject('https://stghrms.paxanimi.ai')
  API_CONTEXT = '/notification-api'
}