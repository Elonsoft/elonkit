import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CategoriesService, ItemsService } from './breadcrumbs-story-basic.service';

@Injectable()
export class HomeBreadcrumbsResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return state.url !== '/' ? { icon: 'home', text: 'Home' } : null;
  }
}

@Injectable()
export class CategoriesListResolver implements Resolve<any> {
  constructor(private categoriesService: CategoriesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.categoriesService.getAll();
  }
}

@Injectable()
export class CategoriesShowResolver implements Resolve<any> {
  constructor(private categoriesService: CategoriesService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.categoriesService.getOne(+route.params.item);
  }
}

@Injectable()
export class CategoriesShowBreadcrumbsResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot) {
    const category = route.parent.data.data.find(e => e.id === +route.params.category);

    return {
      text: category.title,
      breadcrumbs: route.parent.data.data.map(({ id, title }) => ({
        path: id,
        text: title
      }))
    };
  }
}

@Injectable()
export class ItemsResolver implements Resolve<any> {
  constructor(private itemsService: ItemsService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.itemsService.getOne(+route.params.item);
  }
}

@Injectable()
export class ItemsBreadcrumbsResolver implements Resolve<any> {
  resolve(route: ActivatedRouteSnapshot) {
    return { text: route.parent.data.data.title };
  }
}
