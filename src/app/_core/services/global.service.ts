import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalService {
  constructor(@Inject(DOCUMENT) private dom: any) {}

  readonly title: string = 'This Title';

  private labelSource = new BehaviorSubject('This Label');
  currentLabel = this.labelSource.asObservable();

  private descriptionSource = new BehaviorSubject('This Description');
  currentDescription = this.descriptionSource.asObservable();

  private breadcrumbSource = new BehaviorSubject([]);
  currentBreadcrumb = this.breadcrumbSource.asObservable();

  changeLabel(label: string): void {
    this.labelSource.next(label);
  }

  changeDescription(description: string): void {
    this.descriptionSource.next(description);
  }

  changeBreadcrumb(breadcrumb: any): void {
    this.breadcrumbSource.next(breadcrumb);
  }

  changeCanonicalURL(url?: string): void {
    const canURL = url === undefined ? this.dom.URL : url;
    const link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', canURL);
  }

  currentURL(url?: string): string {
    const URL = url === undefined ? this.dom.URL : url;
    return URL;
  }
}
