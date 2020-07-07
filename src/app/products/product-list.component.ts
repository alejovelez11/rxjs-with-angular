import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, of, EMPTY, Subject, combineLatest } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  // selectedCategoryId = 1;
  private categorySelectedSubject = new Subject<number>();
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  // we do it from here
  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
      .pipe(
        startWith(0)
      )
  ]).pipe(
    map(([products, selectedCategoryId]) =>
        products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true
      )
    ),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );


  // productsSimpleFilter$ = this.productService.productsWithCategory$
  //   .pipe(
  //     map(products =>
  //       products.filter(product =>
  //         this.selectedCategoryId ? product.categoryId === this.selectedCategoryId : 'true'
  //       )
  //     )
  //   );

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  /* to receive the service data we already don't call the OnInit */

  // ngOnInit(): void {
  //   this.sub = this.productService.getProducts()
  //     .subscribe(
  //       products => this.products = products,
  //       error => this.errorMessage = error
  //     );
  // }


  /* We already don't the unsubscribe in the ngOnDestroy
   methond because the async pipe do it for us */

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }


  onAdd(): void {
    console.log('Not yet implemented');
    this.productService.addProduct()
  }

  onSelected(categoryId: string): void {
    // this.selectedCategoryId = +categoryId;
    this.categorySelectedSubject.next(+categoryId)
  }
}
