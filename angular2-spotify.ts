import {Injectable, Inject, Optional} from '@angular/core';
import {Http, Headers, Response, Request} from '@angular/http'
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';

export interface SpotifyConfig {
  clientId: string,
  redirectUri: string,
  scope: string,
  authToken?: string,
  apiBase: string,
}

export interface SpotifyOptions {
  limit?: number,
  offset?: number,
  market?: string,
  album_type?: string,
  country?: string,
  type?: string,
  q?: string,
  timestamp?: string,
  locale?: string,
  public?: boolean,
  name?: string,
  time_range?: string,
  after?: string,
  before?: string,
}

export type repeatMode = 'track' | 'context' | 'off';

interface HttpRequestOptions {
  method?: string,
  url: string,
  search?: Object,
  body?: Object,
  headers?: Headers,
}

@Injectable()
//export default class SpotifyService {
export class SpotifyService {
  constructor( @Inject("SpotifyConfig") private config: SpotifyConfig, private http: Http) {
    config.apiBase = 'https://api.spotify.com/v1';
  }

  //#region albums

  /**
* Gets an album
* Pass in album id or spotify uri
*/
  getAlbum(album: string) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}`,
      headers: this.getHeaders(),
    }).map(res => res.json());
  }

  /**
* Gets albums
* Pass in comma separated string or array of album ids
*/
  getAlbums(albums: string | Array<string>) {
    var albumList = this.mountItemList(albums);
    return this.api({
      method: 'get',
      url: `/albums`,
      headers: this.getHeaders(),
      search: { ids: albumList.toString() }
    }).map(res => res.json());
  }

  /**
* Get Album Tracks
* Pass in album id or spotify uri
*/
  getAlbumTracks(album: string, options?: SpotifyOptions) {
    album = this.getIdFromUri(album);
    return this.api({
      method: 'get',
      url: `/albums/${album}/tracks`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  //#endregion

  //#region artists

  /**
* Get an Artist
*/
  getArtist(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  /**
* Get multiple artists
*/
  getArtists(artists: string | Array<string>) {
    var artistList = this.mountItemList(artists);
    return this.api({
      method: 'get',
      url: `/artists/`,
      headers: this.getHeaders(),
      search: { ids: artists.toString() }
    }).map(res => res.json());
  }

  //Artist Albums
  getArtistAlbums(artist: string, options?: SpotifyOptions) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/albums`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  /**
   * Get Artist Top Tracks
   * The country: an ISO 3166-1 alpha-2 country code.
   */
  getArtistTopTracks(artist: string, country: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/top-tracks`,
      headers: this.getHeaders(),
      search: { country: country }
    }).map(res => res.json());
  }

  getRelatedArtists(artist: string) {
    artist = this.getIdFromUri(artist);
    return this.api({
      method: 'get',
      url: `/artists/${artist}/related-artists`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }



  //#endregion

  //#region browse

  getFeaturedPlaylists(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/featured-playlists`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getNewReleases(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/new-releases`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategories(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategory(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCategoryPlaylists(categoryId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/browse/categories/${categoryId}/playlists`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getRecommendations(options?: SpotifyOptions) {
      return this.api({
      method: 'get',
      url: `/recommendations`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getAvailableGenreSeeds () {
      return this.api({
      method: 'get',
      url: `/recommendations/available-genre-seeds`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region following

  following(type: string, options?: SpotifyOptions) {
    options = options || {};
    options.type = type;
    return this.api({
      method: 'get',
      url: `/me/following`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  follow(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'put',
      url: `/me/following`,
      search: { type: type, ids: ids.toString() },
      headers: this.getHeaders()
    });
  }

  unfollow(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'delete',
      url: `/me/following`,
      search: { type: type, ids: ids.toString() },
      headers: this.getHeaders()
    });
  }

  userFollowingContains(type: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/me/following/contains`,
      search: { type: type, ids: ids.toString() },
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  followPlaylist(userId: string, playlistId: string, isPublic?: boolean) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      body: { public: !!isPublic },
      headers: this.getHeaders(true)
    });
  }

  unfollowPlaylist(userId: string, playlistId: string) {
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/followers`,
      headers: this.getHeaders()
    });
  }

  playlistFollowingContains(userId: string, playlistId: string, ids: string | Array<string>) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/followers/contains`,
      search: { ids: ids.toString() },
      headers: this.getHeaders()
    }).map(res => res.json());
  }


  //#endregion

  //#region library

  getSavedUserTracks(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  userTracksContains(tracks: string | Array<string>) {
    var trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/me/tracks/contains`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    }).map(res => res.json());
  }

  saveUserTracks(tracks: string | Array<string>) {
    var trackList = this.mountItemList(tracks);

    return this.api({
      method: 'put',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    });
  }

  removeUserTracks(tracks: string | Array<string>) {
    var trackList = this.mountItemList(tracks);

    return this.api({
      method: 'delete',
      url: `/me/tracks`,
      headers: this.getHeaders(),
      search: { ids: trackList.toString() }
    });
  }

  getSavedUserAlbums(options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  saveUserAlbums(albums: string | Array<string>) {
    var albumList = this.mountItemList(albums);

    return this.api({
      method: 'put',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: { ids: albumList.toString() }
    });
  }

  removeUserAlbums(albums: string | Array<string>) {
    var albumList = this.mountItemList(albums);

    return this.api({
      method: 'delete',
      url: `/me/albums`,
      headers: this.getHeaders(),
      search: { ids: albumList.toString() }
    });
  }

  userAlbumsContains(albums: string | Array<string>) {
    var albumList = this.mountItemList(albums);

    return this.api({
      method: 'get',
      url: `/me/albums/contains`,
      headers: this.getHeaders(),
      search: { ids: albumList.toString() }
    }).map(res => res.json());
  }

  //#endregion
  
  //#region personalization
  
  getUserTopArtists(options?: SpotifyOptions) {
      return this.api({
      method: 'get',
      url: `/me/top/artists`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getUserTopTracks(options?: SpotifyOptions) {
      return this.api({
      method: 'get',
      url: `/me/top/tracks`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getUserRecentlyPlayed(options?: SpotifyOptions) {
      return this.api({
      method: 'get',
      url: `/me/player/recently-played`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }  

  //#endregion

  //#region Player

  getUserAvailableDevices(){
    return this.api({
      method: 'get',
      url: `/me/player/devices`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getUserCurrentPlayback(options?: SpotifyOptions){
      return this.api({
        method: 'get',
        url: `/me/player`,
        headers: this.getHeaders(),
        search: options
      }).map(res => res.json());
    }

  getUserCurrentlyPlayingTrack(options?: SpotifyOptions){
      return this.api({
        method: 'get',
        url: `/me/player/currently-playing`,
        headers: this.getHeaders(),
        search: options
      }).map(res => res.json());
    }    
  
  setTransferPlaybackDevice(deviceIds: string | Array<string>, isPlay?: boolean){
    return this.api({
      method: 'put',
      url: `/me/player`,
      headers: this.getHeaders(),
      body: { device_ids: deviceIds.toString().split(','), play: !!isPlay }
    }).map(res => res.json());
  }

  setPlaybackPlay(deviceId?: string, options?: {context_uri?: string, uris?: string | Array<string>, offset?: { position?: number, uri?: string} }){
    if (options.uris){
      let tracks = options.uris;
      let trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
      trackList.forEach((value, index) => {
        trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
      })
      options.uris = trackList;
    }

    return this.api({
      method: 'put',
      url: `/me/player/play`,
      headers: this.getHeaders(true),
      search: { device_id: deviceId },
      body: options    
    }).map(res => res.json());
  }

  setPlaybackPause(deviceId?: string){
    return this.api({
      method: 'put',
      url: `/me/player/pause`,
      headers: this.getHeaders(),
      search: { device_id: deviceId }
    }).map(res => res.json());
  }

  setPlaybackNextTrack(deviceId?: string){
    return this.api({
      method: 'post',
      url: `/me/player/next`,
      headers: this.getHeaders(),
      search: { device_id: deviceId }
    }).map(res => res.json());
  }

  setPlaybackPreviousTrack(deviceId?: string){
    return this.api({
      method: 'post',
      url: `/me/player/previous`,
      headers: this.getHeaders(),
      search: { device_id: deviceId }
    }).map(res => res.json());
  }
  
  setPlaybackSeekPosition(newPosition: number, deviceId?: string){
    return this.api({
      method: 'put',
      url: `/me/player/seek`,
      headers: this.getHeaders(),
      search: { position_ms: newPosition.toString(), device_id: deviceId }
    }).map(res => res.json());
  }

  setPlaybackRepeat(repeatMode: repeatMode, deviceId?: string){
    return this.api({
      method: 'put',
      url: `/me/player/repeat`,
      headers: this.getHeaders(),
      search: { state: repeatMode.toString(), device_id: deviceId }      
    }).map(res => res.json());
  }
  
  setPlaybackVolume(volumePercent: number, deviceId?: string){
    return this.api({
      method: 'put',
      url: `/me/player/volume`,
      headers: this.getHeaders(),
      search: { volume_percent: volumePercent.toString(), device_id: deviceId }       
    }).map(res => res.json());
  }
  
  setPlaybackShuffle(isShuffle: boolean, deviceId?: string){
    return this.api({
      method: 'put',
      url: `/me/player/shuffle`,
      headers: this.getHeaders(),
      search: { state: !!isShuffle.toString(), device_id: deviceId } 
    }).map(res => res.json());
  }    

      
  //#endregion

  //#region playlists

  getUserPlaylists(userId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  getCurrentUserPlaylists(options?: SpotifyOptions) {
      return this.api({
      method: 'get',
      url: `/me/playlists/`,
      search: options,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getPlaylist(userId: string, playlistId: string, options?: { fields: string }) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  getPlaylistTracks(userId: string, playlistId: string, options?: SpotifyOptions) {
    return this.api({
      method: 'get',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  createPlaylist(userId: string, options: { name: string, public?: boolean }) {
    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists`,
      headers: this.getHeaders(true),
      body: options
    }).map(res => res.json());
  }

  addPlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>, options?: { position: number }) {
    var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    var search = { uris: trackList.toString() };
    if (!!options) search['position'] = options.position;

    return this.api({
      method: 'post',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      search: search
    }).map(res => res.json());
  }

  removePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    var trackUris = [];
    trackList.forEach((value, index) => {
      trackUris[index] = {
        uri: value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value
      };
    });
    return this.api({
      method: 'delete',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: { tracks: trackUris }
    }).map(res => res.json());
  }

  reorderPlaylistTracks(userId: string, playlistId: string, options: { range_start: number, range_length?: number, insert_before: number, snapshot_id?: string }) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(true),
      body: options
    }).map(res => res.json());
  }

  replacePlaylistTracks(userId: string, playlistId: string, tracks: string | Array<string>) {
    var trackList = Array.isArray(tracks) ? tracks : tracks.split(',');
    trackList.forEach((value, index) => {
      trackList[index] = value.indexOf('spotify:') === -1 ? 'spotify:track:' + value : value;
    });

    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}/tracks`,
      headers: this.getHeaders(),
      search: { uris: trackList.toString() }
    }).map(res => res.json());
  }

  updatePlaylistDetails(userId: string, playlistId: string, options: Object) {
    return this.api({
      method: 'put',
      url: `/users/${userId}/playlists/${playlistId}`,
      headers: this.getHeaders(true),
      body: options
    });
  }

  //#endregion

  //#region profiles

  getUser(userId: string) {
    return this.api({
      method: 'get',
      url: `/users/${userId}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getCurrentUser() {
    return this.api({
      method: 'get',
      url: `/me`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  //#endregion

  //#region search

  /**
* Search Spotify
* q = search query
* type = artist, album or track
*/
  search(q: string, type: string, options?: SpotifyOptions) {
    options = options || {};
    options.q = q;
    options.type = type;

    return this.api({
      method: 'get',
      url: `/search`,
      headers: this.getHeaders(),
      search: options
    }).map(res => res.json());
  }

  //#endregion

  //#region tracks

  getTrack(track: string) {
    track = this.getIdFromUri(track);
    return this.api({
      method: 'get',
      url: `/tracks/${track}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }

  getTracks(tracks: string | Array<string>) {
    var trackList = this.mountItemList(tracks);
    return this.api({
        method: 'get',
        url: `/tracks/`,
        headers: this.getHeaders(),
        search: { ids: trackList.toString() }
    }).map(res => res.json());
  }
  
  getTrackAudioAnalysis(track: string) {
    track = this.getIdFromUri(track);
    return this.api({
      method: 'get',
      url: `/audio-analysis/${track}`,
      headers: this.getHeaders()
    }).map(res => res.json());
  }  
  
  getTrackAudioFeatures(track: string) {
      track = this.getIdFromUri(track);
      return this.api({
        method: 'get',
        url: `/audio-features/${track}`,
        headers: this.getHeaders()
      }).map(res => res.json());
  }
  

  getTracksAudioFeatures(tracks: string | Array<string>) {
    var trackList = this.mountItemList(tracks);
    return this.api({
      method: 'get',
      url: `/audio-features/`,
      search: { ids: trackList.toString() },
      headers: this.getHeaders()
    }).map(res => res.json());
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
        if (obj[key] != undefined && obj != null){
          parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
        }
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

  private getHeaders(isJson?: boolean): any {
    return new Headers(this.auth(isJson));
  }

  private getIdFromUri(uri: string) {
    return uri.indexOf('spotify:') === -1 ? uri : uri.split(':')[2];
  }

  private mountItemList(items: string | Array<string>): Array<string> {
    var itemList = Array.isArray(items) ? items : items.split(',');
    itemList.forEach((value, index) => {
      itemList[index] = this.getIdFromUri(value);
    });
    return itemList;
  }

  private handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }

  private api(requestOptions: HttpRequestOptions) {
    return this.http.request(new Request({
      url: this.config.apiBase + requestOptions.url,
      method: requestOptions.method || 'get',
      search: this.toQueryString(requestOptions.search),
      body: JSON.stringify(requestOptions.body),
      headers: requestOptions.headers
    }));
  }

  //#endregion

}