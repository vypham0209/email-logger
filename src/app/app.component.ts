import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, map, switchMap } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { FUNCTIONS } from './app.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  httpClient = inject(HttpClient)
  title = 'email-logger';
  configService = inject(ConfigService)

  totalPage = 0
  templates = FUNCTIONS.EMAIL_TEMPLATES
  page$ = new BehaviorSubject(1)
  template$ = new BehaviorSubject<null | FUNCTIONS.EMAIL_TEMPLATE>(null)
  search$ = new BehaviorSubject('')
  logs$ = combineLatest([
    this.configService.API_HOST$,
    this.page$,
    this.template$,
    this.search$
  ])
    .pipe(
      debounceTime(500),
      switchMap(([_, page, template, search]) => {
        const query: Record<string, any> = { page, limit: 10 }
        if (template) {
          query['template'] = template
        }
        if (search) {
          query['search'] = search
        }
        return this.httpClient.get<{ data: any, total: number }>('/send-mail/logs', { params: query })
      }),
      map(o => {
        this.totalPage = Math.ceil(o.total / 10)
        return o.data.map((data: any) => {
          return {
            ...data,
            createdAt: new Date(data.createdAt).toLocaleString(),
            content: data.content?.replace('\n', ''),
          }
        })
      })
    )

  content: string | null = null

  filterTemplate(e: any) {
    this.template$.next(e.target.value)
  }

  search(e: any) {
    this.search$.next(e.target.value)
  }

  handleChangeCluster(event: any) {
    const value = event.target.value
    this.configService.API_HOST = value
  }

  showContent(content: string) {
    this.content = content

  }
  closeContent() {
    this.content = null
  }

  changePage(value: number) {
    const newValue = this.page$.value + value
    if (newValue > 0) {
      this.page$.next(newValue)
    }
  }
}
