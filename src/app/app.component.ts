import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, map, switchMap } from 'rxjs';
import { ConfigService } from '../services/config.service';

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
  logs$ = new BehaviorSubject<any[]>([])
  data$ = this.configService.API_HOST$
    .pipe(
      switchMap(() => this.httpClient.get<{ data: any }>('/send-mail/logs', { params: { page: 1, limit: 10 } })),
      map(o => {

        return o.data.map((data: any) => {
          console.log(data.content.replace('\n', ''));
          return {
            ...data,
            createdAt: new Date(data.createdAt).toLocaleString(),
            content: data.content.replace('\n', ''),
          }
        })
      })
    )

  content: string | null = null

  ngOnInit() {
    this.data$.subscribe((value) => {
      this.logs$.next(value)
    })
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
}
