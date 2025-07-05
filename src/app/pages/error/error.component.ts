import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, take } from 'rxjs';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent implements OnInit {

constructor(private route: ActivatedRoute){}

sMsg: string | null = '';

ngOnInit(): void {

  this.sMsg = this.route.snapshot.queryParamMap.get('msg')??"".replace(/_/g,'  ');

}

}
