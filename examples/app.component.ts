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
                scope: 'user-follow-modify user-follow-read playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-library-modify user-read-private',
                 // If you already have an authToken
				authToken: localStorage.getItem('angular2-spotify-token')
            }
        })
    ]
})
export class AppComponent {
    private user: Object;
    constructor(private spotifyService: SpotifyService) {
        this.getUser();
    }

    getUser() {
        this.spotifyService.getCurrentUser().subscribe(data => {
            console.log(data);
            this.user = data;
            this.userId = data.id;
            this.doTests();
        }, err=> { console.log(err); });
    }

    login() {
        this.spotifyService.login().subscribe(
            token => {
                console.log(token);
                this.getUser();
            },
            err => console.error(err),
            () => { });
    }

    doTests() {
        this.albumsTests();
        this.artistsTests();
        this.browseTests();
        this.followTests();
        this.libraryTests();
        this.playlistTests();
        this.profilesTests();
        this.searchTests();
        this.trackTests();
    }

    userId;
    trackUri = "spotify:track:49p3JJ7QnwHGqJG0vImRRl";
    trackUri2 = "spotify:track:7cnsxfgpaF1tuXQDkjRs0m";
    trackUri3 = "spotify:track:5h5tBFnbcVioFXiOixTn6E";
    trackUri4 = "spotify:track:7bre6yd84LZ6MFoTppmHja";
    //change for one of your playlists
    playlistId = "2TkWjGCu8jurholsfdWtG4";

    albumsTests() {
        this.spotifyService.getAlbum('0sNOF9WDwhWunNAHPD3Baj')
            .subscribe(data=> { console.log("getAlbum: ", data); },
            err=> console.error(err));

        this.spotifyService.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')
            .subscribe(data=> { console.log("getAlbums: ", data); },
            err=> console.error(err));

        this.spotifyService.getAlbumTracks('6akEvsycLGftJxYudPjmqK', { limit: 50, offset: 5 })
            .subscribe(data=> { console.log("getAlbumTracks: ", data); },
            err=> console.error(err));
    }

    artistsTests() {
        this.spotifyService.getArtist('0LcJLqbBmaGUft1e9Mm8HV')
            .subscribe(data=> { console.log("getArtist: ", data); },
            err=> console.error(err));

        this.spotifyService.getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')
            .subscribe(data=> { console.log("getArtist: ", data); },
            err=> console.error(err));

        this.spotifyService.getArtistAlbums('1vCWHaC5f2uS3yhpwWbIA6')
            .subscribe(data=> { console.log("getArtistAlbums: ", data); },
            err=> console.error(err));

        this.spotifyService.getArtistTopTracks('1vCWHaC5f2uS3yhpwWbIA6', 'AU')
            .subscribe(data=> { console.log("getArtistTopTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.getRelatedArtists('1vCWHaC5f2uS3yhpwWbIA6')
            .subscribe(data=> { console.log("getRelatedArtists: ", data); },
            err=> console.error(err));
    }

    browseTests() {
        this.spotifyService.getFeaturedPlaylists({ locale: "nl_NL", country: "NL" })
            .subscribe(data=> { console.log("getFeaturedPlaylists: ", data); },
            err=> console.error(err));

        this.spotifyService.getNewReleases({ country: "NL" })
            .subscribe(data=> { console.log("getNewReleases: ", data); },
            err=> console.error(err));

        this.spotifyService.getCategories({ country: 'SG' })
            .subscribe(data=> { console.log("getCategories: ", data); },
            err=> console.error(err));

        this.spotifyService.getCategory('party')
            .subscribe(data=> { console.log("getCategory: ", data); },
            err=> console.error(err));

        this.spotifyService.getCategoryPlaylists('party')
            .subscribe(data=> { console.log("getCategoryPlaylists: ", data); },
            err=> console.error(err));
    }

    followTests() {
        this.spotifyService.following('artist', { limit: 10 })
            .subscribe(data=> { console.log("following: ", data); },
            err=> console.error(err));

        this.spotifyService.follow('user', '12170399784')
            .subscribe(data=> { console.log("follow: ", data); },
            err=> console.error(err));

        this.spotifyService.unfollow('user', 'jmperezperez')
            .subscribe(data=> { console.log("unfollow: ", data); },
            err=> console.error(err));

        this.spotifyService.userFollowingContains('user', '12168081530,jmperezperez')
            .subscribe(data=> { console.log("userFollowingContains: ", data); },
            err=> console.error(err));

        this.spotifyService.followPlaylist('12170399784', '2yZQOAhWHaHJk4bHGJJ1LL', false)
            .subscribe(data=> { console.log("followPlaylist: ", data); },
            err=> console.error(err));

        this.spotifyService.unfollowPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT')
            .subscribe(data=> { console.log("unfollowPlaylist: ", data); },
            err=> console.error(err));

        this.spotifyService.playlistFollowingContains('12170399784', '2yZQOAhWHaHJk4bHGJJ1LL', '12176270157,jmperezperez,12168081530')
            .subscribe(data=> { console.log("playlistFollowingContains: ", data); },
            err=> console.error(err));
    }

    libraryTests() {
        this.spotifyService.getSavedUserTracks({ offset: 20, limit: 40 })
            .subscribe(data=> { console.log("getSavedUserTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.userTracksContains('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9,5h5tBFnbcVioFXiOixTn6E')
            .subscribe(data=> { console.log("userTracksContains: ", data); },
            err=> console.error(err));

        this.spotifyService.saveUserTracks(this.trackUri3 + "," + this.trackUri4)
            .subscribe(data=> { console.log("saveUserTracks: ", data); },
            err=> { console.error(err) });

        this.spotifyService.removePlaylistTracks(this.userId, this.playlistId, this.trackUri + "," + this.trackUri2)
            .subscribe(data=> { console.log("removePlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.getSavedUserAlbums()
            .subscribe(data=> { console.log("getSavedUserAlbums: ", data); },
            err=> console.error(err));

        this.spotifyService.saveUserAlbums('2Z8egw5FwFr6rs8U0NQUAb,6zs38EUdnNNM2Pg6IHrfoK')
            .subscribe(data=> { console.log("saveUserAlbums: ", data); },
            err=> console.error(err));

        this.spotifyService.removeUserAlbums('2Z8egw5FwFr6rs8U0NQUAb,6zs38EUdnNNM2Pg6IHrfoK')
            .subscribe(data=> { console.log("removeUserAlbums: ", data); },
            err=> console.error(err));

        this.spotifyService.userAlbumsContains('2Z8egw5FwFr6rs8U0NQUAb,6zs38EUdnNNM2Pg6IHrfoK')
            .subscribe(data=> { console.log("userAlbumsContains: ", data); },
            err=> console.error(err));
    }

    playlistTests() {
        this.spotifyService.getUserPlaylists(this.userId, { offset: 20, limit: 40 })
            .subscribe(data=> { console.log("getUserPlaylists: ", data); },
            err=> console.error(err));

        this.spotifyService.getPlaylist(this.userId, this.playlistId)
            .subscribe(data=> { console.log("getPlaylist: ", data); },
            err=> console.error(err));

        this.spotifyService.getPlaylistTracks(this.userId, this.playlistId, { offset: 20, limit: 40 })
            .subscribe(data=> { console.log("getPlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.createPlaylist(this.userId, { name: "ne333", public: false })
            .subscribe(data=> { console.log("createPlaylist: ", data); },
            err=> console.error(err));

        this.spotifyService.addPlaylistTracks(this.userId, this.playlistId, [this.trackUri, this.trackUri2])
            .subscribe(data=> { console.log("addPlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.removePlaylistTracks(this.userId, this.playlistId, this.trackUri + "," + this.trackUri2)
            .subscribe(data=> { console.log("removePlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.reorderPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', {
            range_start: 0,
            range_length: 2,
            insert_before: 4
        }).subscribe(data=> { console.log("reorderPlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.replacePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4Eiq0Hb4EgwNIvPct32YMQ,spotify:track:1301WleyT98MSxVHPZCA6M')
            .subscribe(data=> { console.log("replacePlaylistTracks: ", data); },
            err=> console.error(err));

        this.spotifyService.updatePlaylistDetails('1176458919', '2TkWjGCu8jurholsfdWtG4', { name: 'Updated Playlist Title' })
            .subscribe(data=> { console.log("updatePlaylistDetails: ", data); },
            err=> console.error(err));
    }

    profilesTests() {
        this.spotifyService.getUser('12170399784')
            .subscribe(data=> { console.log("getUser: ", data); },
            err=> console.error(err));

        this.spotifyService.getCurrentUser()
            .subscribe(data=> { console.log("getCurrentUser: ", data); },
            err=> console.error(err));
    }

    searchTests() {
        this.spotifyService.search('Nirvana', 'artist', { limit: 40, offset: 10 })
            .subscribe(data=> { console.log("search: ", data); },
            err=> console.error(err));
    }

    trackTests() {
        this.spotifyService.getTrack('0eGsygTp906u18L0Oimnem')
            .subscribe(data=> { console.log("getTrack: ", data); },
            err=> console.error(err));

        this.spotifyService.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G')
            .subscribe(data=> { console.log("getTracks: ", data); },
            err=> console.error(err));
    }

}