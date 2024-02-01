import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Octokit } from 'octokit';
import { BehaviorSubject, combineLatest, debounceTime, map, switchMap } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { FUNCTIONS } from './app.enum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {


  repos = [
    {
      repo: 'HROS_Micro-service_Super-Admin-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Backend-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Expenso-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Employee-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Ticket-v2-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Auth-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Setting-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Notification-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Epas-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Timesheet-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Customer-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Project-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Payroll-Service',
      url: '',
      error: '',
    },
    {
      repo: 'HROS_Micro-service_Attendance-Service',
      url: '',
      error: '',
    },
    {
      repo: 'Asset-Management-V2',
      url: '',
      error: '',
    },
  ]

  prResult: {
    repo: string
    error?: string
    url?: string
  }[] = []

  formBuilder = new FormBuilder().nonNullable
  form = this.formBuilder.group(
    {
      token: '',
      fromBranch: ['integration'],
      toBranch: ['dev'],
      repos: this.formBuilder.array(this.repos.map(x => false))
    },
  )


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

  async pullRequest() {
    const { fromBranch, toBranch, repos, token } = this.form.value as Required<typeof this.form.value>
    const findRepos: string[] = []

    repos.forEach((value, index) => {
      if (value) findRepos.push(this.repos[index].repo)
    })

    findRepos.forEach(async value => {
      const index = this.repos.findIndex(o => o.repo === value)
      try {
        const octokit = new Octokit({ auth: token })
        const res = await octokit.rest.pulls.create({
          owner: 'paxanimi-hr-os',
          repo: value,
          title: `${fromBranch} to ${toBranch}`,
          head: fromBranch,
          base: toBranch,
        })
        this.repos.splice(index, 1, {
          repo: value,
          url: res.data.html_url,
          error: ''
        })
      } catch (error: any) {
        this.repos.splice(index, 1, {
          repo: value,
          url: '',
          error: error?.response?.data?.errors?.map((o: any) => o.message)?.join(',')
        })
      }
      console.log(this.repos);
    })

  }
}
