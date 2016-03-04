import {Injectable, Inject, Optional} from 'angular2/core';
import {Http, Headers, Response, Request} from 'angular2/http'
import {Observable}     from 'rxjs/Observable';
import 'rxjs/Rx';

export interface SpotifyConfig {
    clientId: string,
    redirectUri: string,
    scope: string,
    authToken?: string,
    apiBase: string,
}

export interface OptionsLimitOffset {
    limit?: number,
    offset?: number,
}

@Injectable()
export class SpotifyService {
    constructor( @Inject("SpotifyConfig") private config: SpotifyConfig, private http: Http) {
        config.apiBase = 'https://api.spotify.com/v1';
    }

    //#region playlists

    getUserPlaylists(userId: string, options?: OptionsLimitOffset) {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/users/${userId}/playlists`,
            headers: this.getHeaders(),
            search: this.toQueryString(options)
        })).map(res=> res.json());
    }

    getPlaylist(userId: string, playlistId: string, options?: { fields: string }) {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/users/${userId}/playlists/${playlistId}`,
            headers: this.getHeaders(),
            search: this.toQueryString(options)
        })).map(res=> res.json());
    }

    getPlaylistTracks(userId: string, playlistId: string, options?: OptionsLimitOffset) {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/users/${userId}/playlists/${playlistId}/tracks`,
            headers: this.getHeaders(),
            search: this.toQueryString(options)
        })).map(res=> res.json());
    }

    createPlaylist(userId: string, options: { name: string, public?: boolean }) {
        return this.http.request(new Request({
            method: 'post',
            url: `${this.config.apiBase}/users/${userId}/playlists`,
            headers: this.getHeaders(true),
            body: JSON.stringify(options)
        })).map(res=> res.json());
    }

    addPlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>, options?: { position: number }) {
        var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
        trackList.forEach((value, index) => {
            trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
        });

        var search = { uris: trackList.toString() };
        if (!!options) search['position'] = options.position;

        return this.http.request(new Request({
            method: 'post',
            url: `${this.config.apiBase}/users/${userId}/playlists/${playlistId}/tracks`,
            headers: this.getHeaders(true),
            search: this.toQueryString(search)
        })).map(res=> res.json());
    }

    removePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
        var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
        var trackUris = [];
        trackList.forEach((value, index) => {
            trackUris[index] = {
                uri: value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value
            };
        });
        return this.http.request(new Request({
            method: 'delete',
            url: `${this.config.apiBase}/users/${userId}/playlists/${playlistId}/tracks`,
            headers: this.getHeaders(true),
            body: JSON.stringify({ tracks: trackUris })
        })).map(res=> res.json());
    }

    //#endregion

    //#region library

    getSavedUserTracks(options?: OptionsLimitOffset) {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/me/tracks`,
            headers: this.getHeaders(),
            search: this.toQueryString(options)
        })).map(res=> res.json());
    }

    saveUserTracks(tracks: string | Array<string>) {
        var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
        trackList.forEach((value, index) => {
            trackList[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });

        return this.http.request(new Request({
            method: 'put',
            url: `${this.config.apiBase}/me/tracks`,
            headers: this.getHeaders(),
            search: this.toQueryString({ ids: trackList.toString() })
        }));
    }

    removeUserTracks(tracks: string | Array<string>) {
        var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
        trackList.forEach((value, index) => {
            trackList[index] = value.indexOf('spotify:') > -1 ? value.split(':')[2] : value;
        });

        return this.http.request(new Request({
            method: 'delete',
            url: `${this.config.apiBase}/me/tracks`,
            headers: this.getHeaders(),
            search: this.toQueryString({ ids: trackList.toString() })
        }));
    }

    //#endregion

    //#region profiles

    getUser(userId: string) {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/users/${userId}`
        })).map(res=> res.json());
    }

    getCurrentUser() {
        return this.http.request(new Request({
            method: 'get',
            url: `${this.config.apiBase}/me`,
            headers: this.getHeaders()
        })).map(res=> res.json());
    }

    //#endregion

    //#region login

    login() {
        var promise = new Promise((resolve, reject) => {
            var w = 400,
                h = 500,
                left = (screen.width / 2) - (w / 2),
                top = (screen.height / 2) - (h / 2);

            var params = {
                client_id: this.config.clientId,
                redirect_uri: this.config.redirectUri,
                scope: this.config.scope || '',
                response_type: 'token'
            };
            var authCompleted = false;
            var authWindow = this.openDialog(
                'https://accounts.spotify.com/authorize?' + this.toQueryString(params),
                'Spotify',
                'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=' + w + ',height=' + h + ',top=' + top + ',left=' + left,
                () => {
                    if (!authCompleted) {
                        return reject('Login rejected error');
                    }
                }
            );

            var storageChanged = (e) => {
                if (e.key === 'angular2-spotify-token') {
                    if (authWindow) {
                        authWindow.close();
                    }
                    authCompleted = true;

                    this.config.authToken = e.newValue;
                    window.removeEventListener('storage', storageChanged, false);

                    return resolve(e.newValue);
                }
            };
            window.addEventListener('storage', storageChanged, false);
        });

        return Observable.fromPromise(promise).catch(this.handleError);
    }

    //#endregion

    //#region utils

    private toQueryString(obj: Object): string {
        var parts = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        };
        return parts.join('&');
    };

    private openDialog(uri, name, options, cb) {
        var win = window.open(uri, name, options);
        var interval = window.setInterval(() => {
            try {
                if (!win || win.closed) {
                    window.clearInterval(interval);
                    cb(win);
                }
            } catch (e) { }
        }, 1000000);
        return win;
    }

    private auth(isJson?: boolean): Object {
        var auth = {
            'Authorization': 'Bearer ' + this.config.authToken
        };
        if (isJson) {
            auth['Content-Type'] = 'application/json';
        }
        return auth;
    }

    private getHeaders(isJson?: boolean) {
        return new Headers(this.auth(isJson));
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    //#endregion

}