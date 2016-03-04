import {Component, provide} from 'angular2/core';
import {SpotifyService} from './spotify.service';

@Component({
    selector: 'my-app',
    template: `
    <h1>angular2-spotify</h1>
    <button *ngIf="!user" (click)="login()">Login</button>
    <p *ngIf="!!user">You are logged in as: {{user.display_name}}</p>
  `,
    providers: [
        SpotifyService,
        provide("SpotifyConfig", {
            useValue: {
                clientId: 'ABC123DEF456GHfddId789JKL',
                redirectUri: 'http://www.example.com/callback.html',
                scope: 'user-read-private',
				// If you already have an authToken
				authToken: 'zoasliu1248sdfudfiknuha7882iu4rdfnuwehifskmkiuwhjg23'
            }
        })
    ]
})
export class AppComponent {
    private user: Object;
    constructor(private spotifyService: SpotifyService) { }

    login() {
        this.spotifyService.login().subscribe(
            token => {
                console.log(token);

                this.spotifyService.getCurrentUser()
                    .subscribe(data=> { console.log("getCurrentUser: ", data); this.user = data },
                    err=> console.error(err));

            },
            err => console.error(err),
            () => { });
    }
}