import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { GamedataService } from 'src/app/gamedata.service';
import { map, filter, scan } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TipsDataService } from 'src/app/tips-data.service';
import { TeamdataService } from 'src/app/teamdata.service';


@Component({
  selector: 'app-winning-prediction',
  templateUrl: './winning-prediction.component.html',
  styleUrls: ['./winning-prediction.component.css']
})
export class WinningPredictionComponent implements OnInit {

  fav : string;
  games : any = [];
  tips : any = [];
  filterobj : any = [];
  futureGameDate: any = [];
  count : number = 0;
  conf : number = 0;
  value: any;
  teamsM :any = [];
  teamName :string;
  hconf :any = [];

  setFavTeam(val){
    this.fav = val;
    this.ngOnInit();
  }

  constructor(private route :ActivatedRoute,private gameService : GamedataService, private tipsService : TipsDataService, private http : HttpClient, private teamServiceM:TeamdataService )
  {

  }

  ngOnInit() {

    this.teamServiceM.getTeam().subscribe(response => {
      for (var i=0 ; i < response['teams'].length ; i++)
      {
        this.teamsM[i] = response['teams'][i];
      }
    })

    this.gameService.getgames().subscribe( response =>
      {
        var filterCount : number = 0;

        for (var i=0; i < response['games'].length ; i++)
        {
          this.games[i] = response['games'][i];

          if (this.games[i].ateam === this.fav || this.games[i].hteam === this.fav && this.games[i].complete === 0)
          {
            this.filterobj[filterCount] = this.games[i];
            this.futureGameDate[filterCount] = this.filterobj[filterCount].date;
            filterCount++;
          }
        }

        this.tipsService.gettips().subscribe(
          response =>
          {
            for (var i=0; i < response['tips'].length ; i++)
            {
              this.tips[i] = response['tips'][i];

              for (var j = 0; j < filterCount; j++)
              {
                if (this.tips[i].date === this.futureGameDate[j])
                {
                  //console.log(this.tips[i].confidence)
                  this.hconf[i] = this.tips[i].hconfidence;
                  console.log(this.hconf[i]+"asdasd");
                  this.conf += parseFloat(this.tips[i].hconfidence);
                  this.count++;

                }
              }
            }

            this.value = ((this.conf/(this.count+1)).toFixed( 2 ));
            console.log(this.value);
          }
        )
      })


    }

    // getProbability() {
    //   this.value = ((this.conf/(this.count+1)).toFixed( 2 ) );
    // }
    selectTeam(deviceValue)
    {
      this.teamName = deviceValue;
      this.fav = deviceValue;
      this.ngOnInit();
      //this.router.navigate(['../../win']);
    }
    getLogo(tn:String)
    {
      if (tn =="Western Bulldogs")
      {
        return 'https://squiggle.com.au/wp-content/themes/squiggle/assets/images/Bulldogs.jpg';
      }
      if (tn == "Brisbane Lions")
      {
        return 'https://squiggle.com.au/wp-content/themes/squiggle/assets/images/Brisbane.jpg';
      }
      if (tn == "Greater Western Sydney")
      {
        return 'https://squiggle.com.au/wp-content/themes/squiggle/assets/images/Giants.png';
      }
      else
      {
        return 'https://squiggle.com.au/wp-content/themes/squiggle/assets/images/'+tn.split(" ").join("")+'.jpg';
      }
    }
  }
