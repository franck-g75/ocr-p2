import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MyErrorHandler } from 'src/app/core/models/errors/MyErrorHandler';
import { ErrorComponent } from './pages/error/error.component';
@NgModule({
  declarations: [AppComponent, HomeComponent, DetailComponent, ErrorComponent, NotFoundComponent],
  imports: [ BrowserModule, AppRoutingModule, HttpClientModule, NgxChartsModule, BrowserAnimationsModule], 
  providers: [{provide: ErrorHandler, useClass: MyErrorHandler}],
  bootstrap: [AppComponent],
})
export class AppModule {}






