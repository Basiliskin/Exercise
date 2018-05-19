import { Component, OnInit } from '@angular/core';
import { Jsonp } from '@angular/http';
import { HttpParams,HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {trigger,transition, query, style, animate,stagger,keyframes } from '@angular/animations';
import { map } from "rxjs/operators";


@Component({
  selector: 'app-root',
  animations: [
    trigger('goals', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), {optional: true}),

        query(':enter', stagger('300ms', [
          animate('.6s ease-in', keyframes([
            style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateY(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateY(0)',     offset: 1.0}),
          ]))]), {optional: true}),
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public isVisible = false;
  public Data = [];
  public AllData = [];
  private api_key = "b3b6ad792888e10eaf2ea908a7517c3e";
  private base_url= "https://api.flickr.com/services/rest/";
  private perPage = '50';

  constructor(private http:HttpClient){

  }
  jsonFlickrApi()
  {
    console.log(arguments);
  }
  getPublic()
  {
    let result: any;
    let params = new HttpParams()
      .set('method', 'flickr.photos.getRecent')
      .set('api_key', this.api_key)
      .set('per_page', this.perPage)
      .set('format','json')
      .set('nojsoncallback','?')
    ;

    const url = `${this.base_url}?${params.toString()}`;
    result = this.http.get(url).subscribe((data)=>{
      const photos = data.photos.photo;
      let d = [];
      for(let i=0;i<photos.length;i++)
      {
        const item = photos[i];
        d.push({
            title:item.title,
            src:`http://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}.jpg`
        });
      }
      this.AllData = d;
      this.Data = this.AllData;
      this.isVisible = true;

    });
    return result;
  }
  filterInput(value)
  {
    this.Data = this.AllData.filter((elm)=>elm.title.indexOf(value)>=0);
    //console.log('filterInput',value)
  }
  onClose()
  {
    this.isVisible = false;
  }
  ngOnInit() {
    this.getPublic();
  }
  

}
