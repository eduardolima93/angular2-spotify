# angular2-spotify
Angular2 service to connect to the [Spotify Web API](https://developer.spotify.com/web-api/)

Based off [eddiemoore](https://github.com/eddiemoore)'s [angular-spotify](https://github.com/eddiemoore/angular-spotify)

###still under development

###Calls done:

- getUserPlaylists
- getPlaylist
- getPlaylistTracks
- createPlaylist
- addPlaylistTracks
- removePlaylistTracks
- getSavedUserTracks
- saveUserTracks
- removeUserTracks
- getUser
- getCurrentUser
- login


###Usage example

```
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
}```

---------------------------

Check out my [Playlist Manager](http://www.playlist-manager.com/) for Spotify
