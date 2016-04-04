# angular2-spotify
Angular2 service to connect to the [Spotify Web API](https://developer.spotify.com/web-api/)

Based off [eddiemoore](https://github.com/eddiemoore)'s [angular-spotify](https://github.com/eddiemoore/angular-spotify).
Big thanks to him

## Usage

Install angular2-spotify via npm. Use the --save property to save into your package.json file.
```shell
npm install angular2-spotify --save
```

Provide Spotify Service into your component (only provide in your root componenent, but remember to import the service to every class you want to use it)
```ts
import {Component, provide} from 'angular2/core';
import {SpotifyService} from 'angular2-spotify';

@Component({
    providers: [
        SpotifyService,
        provide("SpotifyConfig", {
            useValue: {
                clientId: '<CLIENT_ID>',
                redirectUri: '<CALLBACK_URI>',
                scope: '<SCOPE>',
                // If you already have an auth token
                authToken: '<AUTH_TOKEN>'
            }
        })
    ]
})
export class AppComponent {...}
```

Most of the functions in Spotify do not require you to authenticate your application. However if you do need to gain access to playlists or a user's data then add the necessary scopes:


For example:
```ts
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
```


Inject Spotify into a component to gain access to all the functions available
```ts
    constructor(private spotifyService: SpotifyService) {
        
    }
```


### Albums

#### Get an Album
Get Spotify catalog information for a single album.
```ts
this.spotifyService.getAlbum('AlbumID or Spotify Album URI');
```
Example:
```ts
this.spotifyService.getAlbum('0sNOF9WDwhWunNAHPD3Baj').subscirbe(data => {
  console.log(data);
});
```


#### Get Several Albums
Get Spotify catalog information for multiple albums identified by their Spotify IDs.
```ts
this.spotifyService.getAlbums('Array or comma separated list of Album IDs');
```
Example:
```ts
this.spotifyService
  .getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Get an Album’s Tracks
Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
```ts
this.spotifyService.getAlbumTracks('AlbumID or Spotify Album URI', options);
```
##### Options Object (Optional)
 - limit - Optional. The maximum number of tracks to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - Optional. The index of the first track to return. Default: 0 (the first object). Use with limit to get the next set of tracks.

Example:
```ts
this.spotifyService.getAlbumTracks('6akEvsycLGftJxYudPjmqK').subscirbe(data => {
  console.log(data);
});
```


### Artists
#### Get an Artist
Get Spotify catalog information for a single artist identified by their unique Spotify ID or Spotify URI.

```ts
this.spotifyService.getArtist('Artist Id or Spotify Artist URI');
```
Example
```ts
this.spotifyService.getArtist('0LcJLqbBmaGUft1e9Mm8HV').subscirbe(data => {
  console.log(data);
});
```

#### Get Several Artists
Get Spotify catalog information for several artists based on their Spotify IDs.
```ts
this.spotifyService.getArtists('Comma separated string or array of Artist Ids');
```
Example:
```ts
this.spotifyService
  .getArtists('0oSGxfWSnnOXhD2fKuz2Gy,3dBVyJ7JuOMt4GE9607Qin')
  .subscirbe(data => {
    console.log(data);
  });
```

#### Get an Artist’s Albums
Get Spotify catalog information about an artist’s albums. Optional parameters can be passed in to filter and sort the response.
```ts
this.spotifyService.getArtistAlbums('Artist Id or Spotify Artist URI', options);
```

##### Options Object (Optional)
 - album_type - Optional A comma-separated list of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are:
   - album
   - single
   - appears_on
   - compilation

Example: { album_type: 'album,single' }
 - country - Optional. An ISO 3166-1 alpha-2 country code. Supply this parameter to limit the response to one particular country. Note if you do not provide this field, you are likely to get duplicate results per album, one for each country in which the album is available!
 - limit - The number of album objects to return. Default: 20. Minimum: 1. Maximum: 50. For example: { limit: 2 }
 - offset - Optional. The index of the first album to return. Default: 0 (i.e., the first album). Use with limit to get the next set of albums.


Example:
```ts
this.spotifyService.getArtistAlbums('1vCWHaC5f2uS3yhpwWbIA6').subscirbe(data => {
  console.log(data);
});
```


#### Get an Artist’s Top Tracks
Get Spotify catalog information about an artist’s top tracks by country.
```ts
this.spotifyService.getArtistTopTracks('Artist Id or Spotify Artist URI', 'Country Code');
```
- The country: an ISO 3166-1 alpha-2 country code.


Example:
```ts
this.spotifyService
  .getArtistTopTracks('1vCWHaC5f2uS3yhpwWbIA6', 'AU')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Get an Artist’s Related Artists
Get Spotify catalog information about artists similar to a given artist. Similarity is based on analysis of the Spotify community’s listening history.
```ts
this.spotifyService.getRelatedArtists('Artist Id or Spotify Artist URI');
```
Example:
```ts
this.spotifyService.getRelatedArtists('1vCWHaC5f2uS3yhpwWbIA6').subscirbe(data => {
  console.log(data);
});
```


### Browse
Discover new releases and featured playlists. User needs to be logged in to gain access to these features.

#### Get the featured playlists
Get a list of Spotify featured playlists
```ts
this.spotifyService.getFeaturedPlaylists(options);
```
##### Options Object (Optional)
 - locale - string - Optional. The desired language, consisting of a lowercase ISO 639 language code and an uppercase ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the results returned in a particular language (where available).
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - timestamp - string - Optional.  A timestamp in ISO 8601 format: yyyy-MM-ddTHH:mm:ss. Use this parameter to specify the user's local time to get results tailored for that specific date and time in the day. If not provided, the response defaults to the current UTC time. Example: "2014-10-23T09:00:00" for a user whose local time is 9AM.

Example:
```ts
this.spotifyService
  .getFeaturedPlaylists({ locale: "nl_NL", country: "NL" })
  .subscirbe(data => {
    console.log(data);
  });
```

#### Get new releases
Get a list of new album releases featured in Spotify
```ts
this.spotifyService.getNewReleases(options);
```
##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.

Example:
```ts
this.spotifyService.getNewReleases({ country: "NL" }).subscirbe(data => {
  console.log(data);
});
```

#### Get categories
Get a list of categories used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
```ts
this.spotifyService.getCategories(options);
```

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - locale - string - Optional. The desired language, consisting of an ISO 639 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category metadata returned in a particular language.
 - limit - number - Optional. The maximum number of categories to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - number - Optional. The index of the first item to return. Default: 0 (the first object). Use with ```limit``` to get the next set of categories.

Example:
```ts
this.spotifyService.getCategories({ country: 'SG' }).subscirbe(data => {
  console.log(data);
});
```

#### Get category
Get a single category used to tag items in Spotify (on, for example, the Spotify player’s “Browse” tab).
```ts
this.spotifyService.getCategory(category_id, options);
```

##### Required
- category_id - The Spotify category ID for the category.

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - locale - string - Optional. The desired language, consisting of an ISO 639 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. For example: es_MX, meaning "Spanish (Mexico)". Provide this parameter if you want the category metadata returned in a particular language.

Example:
```ts
this.spotifyService.getCategory('party').subscirbe(data => {
  console.log(data);
})
```

#### Get category playlists
Get a list of Spotify playlists tagged with a particular category.
```ts
this.spotifyService.getCategoryPlaylists(category_id, options);
```

##### Required
- category_id - The Spotify category ID for the category.

##### Options Object (Optional)
 - country - string - Optional. A country: an ISO 3166-1 alpha-2 country code. Provide this parameter if you want the list of returned items to be relevant to a particular country. If omitted, the returned items will be relevant to all countries.
 - limit - number - Optional. The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 - offset - number - Optional. The index of the first item to return. Default: 0 (the first object). Use with ```limit``` to get the next set of items.

 Example:
 ```ts
 this.spotifyService.getCategoryPlaylists('party').subscirbe(data => {
   console.log(data);
 })
 ```


### Follow
These endpoints allow you manage the list of artists and users that a logged in user follows. Following and unfollowing requires the ```user-follow-modify``` scope. Check if Current User Follows requires the ```user-follow-read``` scope.

#### Get User’s Followed Artists
Get the current user’s followed artists.

```ts
this.spotifyService.following('type', options)
```
- type: Required. currently only ```artist``` is supported.


```ts
this.spotifyService.following('artist', { limit: 10 }).subscirbe(artists => {
  console.log(artists);
})
```

#### Follow Artists or Users
Add the current user as a follower of one or more artists or other Spotify users.
```ts
this.spotifyService.follow('type', 'ids');
```
- type: Required. either ```artist``` or ```user```

Example:
```ts
this.spotifyService.follow('user', 'exampleuser01').subscirbe(data => {
 // no response from Spotify
});
```

#### Unfollow Artists or Users
Remove the current user as a follower of one or more artists or other Spotify users.
```ts
this.spotifyService.unfollow('type', 'ids');
```
- type: Required. either ```artist``` or ```user```

Example:
```ts
this.spotifyService.unfollow('user', 'exampleuser01').subscirbe(data => {
 // no response from Spotify
});
```

#### Check if Current User Follows
Check to see if the current user is following one or more artists or other Spotify users.
```ts
this.spotifyService.userFollowingContains('type', 'ids');
```
- type: Required. either ```artist``` or ```user```
- ids: Required. comma-separated list.

Example:
```ts
this.spotifyService.userFollowingContains('user', 'exampleuser01').subscirbe(data => {
  console.log(data);
});
```

#### Follow a Playlist
Add the current user as a follower of a playlist. Requires ```playlist-modify-public``` or ```playlist-modify-private``` scope to work.
```ts
this.spotifyService.followPlaylist('owner_id', 'playlist_id', isPublic);
```
- owner_id: The Spotify user ID of the person who owns the playlist.
- playlist_id: The Spotify ID of the playlist. Any playlist can be followed, regardless of its public/private status, as long as you know its playlist ID.
- isPublic: Boolean (Optional), default true. If true the playlist will be included in user's public playlists, if false it will remain private.

Example:
```ts
this.spotifyService
 .followPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', false)
 .subscirbe(data => {
   console.log(data);
 });
```

#### Unfollow a Playlist
Remove the current user as a follower of a playlist. Requires ```playlist-modify-public``` or ```playlist-modify-private``` scope to work.
```ts
this.spotifyService.unfollowPlaylist('owner_id', 'playlist_id', isPublic);
```
- owner_id: The Spotify user ID of the person who owns the playlist.
- playlist_id: The Spotify ID of the playlist that is to be no longer followed.

Example:
```ts
this.spotifyService
 .unfollowPlaylist('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT')
 .subscirbe(data => {
   console.log(data);
 });
```

#### Check if Users Follow a Playlist
 Check to see if one or more Spotify users are following a specified playlist.Following a playlist can be done publicly or privately. Checking if a user publicly follows a playlist doesn't require any scopes; if the user is publicly following the playlist, this endpoint returns true.

 Checking if the user is privately following a playlist is only possible for the current user when that user has granted access to the ```playlist-read-private``` scope.
 ```ts
 this.spotifyService
 .playlistFollowingContains('owner_id', 'playlist_id', 'comma separated string or array of user ids');
 ```
 Example:
 ```ts
 this.spotifyService.playlistFollowingContains('jmperezperez', '2v3iNvBX8Ay1Gt2uXtUKUT', 'possan,elogain').subscirbe(data => {
   console.log(data);
 });
 ```


### Library *(may have name changes in next version)*
#### Get Current User’s Saved Tracks
Get a list of the songs saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```ts
this.spotifyService.getSavedUserTracks(options);
```
##### Options Object (Optional)

- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.

```ts
this.spotifyService.getSavedUserTracks().subscirbe(data => {
  console.log(data);
});
```


#### Check Current User’s Saved Tracks
Check if one or more tracks is already saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.

```ts
this.spotifyService.userTracksContains('comma separated string or array of spotify track ids');
```
Example:
```ts
this.spotifyService
  .userTracksContains('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .subscirbe(data => {
   console.log(data);
  });
```


#### Save Tracks for Current User
Save one or more tracks to the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```ts
this.spotifyService.saveUserTracks('comma separated string or array of spotify track ids');
```
Example:
```ts
this.spotifyService
  .saveUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Remove Tracks for Current User
Remove one or more tracks from the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```ts
this.spotifyService.removeUserTracks('comma separated string or array of spotify track ids');
```
Example:
```ts
this.spotifyService
  .removeUserTracks('0udZHhCi7p1YzMlvI4fXoK,3SF5puV5eb6bgRSxBeMOk9')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Get Current User’s Saved Albums
Get a list of the albums saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.
```ts
this.spotifyService.getSavedUserAlbums(options);
```
##### Options Object (Optional)

- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.
- market - Optional. An ISO 3166-1 alpha-2 country code. Provide this parameter if you want to apply Track Relinking.

```ts
this.spotifyService.getSavedUserAlbums().subscirbe(data => {
  console.log(data);
});
```


#### Save Albums for Current User
Save one or more albums to the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```ts
this.spotifyService.saveUserAlbums('comma separated string or array of spotify album ids');
```
Example:
```ts
this.spotifyService
  .saveUserAlbums('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Remove Albums for Current User
Remove one or more albums from the current user’s “Your Music” library. Requires the ```user-library-modify``` scope.
```ts
this.spotifyService.removeUserAlbums('comma separated string or array of spotify album ids');
```
Example:
```ts
this.spotifyService
  .removeUserAlbums('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Check User’s Saved Albums
Check if one or more albums is already saved in the current Spotify user’s “Your Music” library. Requires the ```user-library-read``` scope.

```ts
this.spotifyService.userAlbumsContains('comma separated string or array of spotify album ids');
```
Example:
```ts
this.spotifyService
  .userAlbumsContains('4iV5W9uYEdYUVa79Axb7Rh,1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
   console.log(data);
  });
```


### Playlists
User needs to be logged in to gain access to playlists

#### Get a List of a User’s Playlists
Get a list of the playlists owned by a Spotify user. Requires the ```playlist-read-private``` scope
```ts
this.spotifyService.getUserPlaylists('user_id', options);
```
##### Options Object (Optional)
- limit - Optional. The maximum number of playlists to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first playlist to return. Default: 0 (the first object). Use with limit to get the next set of playlists.

Example:
```ts
this.spotifyService.getUserPlaylists('wizzler').subscirbe(data => {
  console.log(data);
});
```


#### Get a Playlist
Get a playlist owned by a Spotify user.
```ts
this.spotifyService.getPlaylist('user_id', 'playlist_id', options);
```
##### Options Object (Optional)
- fields - Optional. Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. Sub-fields can be excluded by prefixing them with an exclamation mark. [More Info](https://developer.spotify.com/web-api/get-playlist/)

```ts
this.spotifyService
  .getPlaylist('1176458919', '6Df19VKaShrdWrAnHinwVO')
  .subscirbe(data => {
    console.log(data);
  });
```


#### Get a Playlist’s Tracks
Get full details of the tracks of a playlist owned by a Spotify user. Requires the ```playlist-read-private``` scope.
```ts
this.spotifyService.getPlaylistTracks('user_id', 'playlist_id', options);
```
Example:
```ts
this.spotifyService
  .getPlaylistTracks('1176458919', '6Df19VKaShrdWrAnHinwVO')
  .subscirbe(data => {
   console.log(data);
  });
```

#### Create a Playlist
Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.) Creating a public playlist requires the ```playlist-modify-public``` scope. Creating a private playlist requires the ```playlist-modify-private``` scope.
```ts
this.spotifyService.createPlaylist('user_id', options);
```
##### Options Object
- name - string - Required. The name for the new playlist, for example "Your Coolest Playlist". This name does not need to be unique; a user may have several playlists with the same name.
- public - boolean - Optional, default true. If true the playlist will be public, if false it will be private. To be able to create private playlists, the user must have granted the playlist-modify-private scope.


Example:
```ts
this.spotifyService
  .createPlaylist('1176458919', { name: 'Awesome Mix Vol. 1' })
  .subscirbe(data => {
   console.log('playlist created');
  });
```


#### Add Tracks to a Playlist
Add one or more tracks to a user’s playlist. Adding tracks to a public playlist requires the ```playlist-modify-public``` scope. Adding tracks to a private playlist requires the ```playlist-modify-private``` scope.
```ts
this.spotifyService.addPlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track uris');
```
##### Options Object (Optional)
- position - integer - Optional. The position to insert the tracks, a zero-based index. For example, to insert the tracks in the first position: position=0; to insert the tracks in the third position: position=2. If omitted, the tracks will be appended to the playlist. Tracks are added in the order they are listed in the query string or request body.


Example:
```ts
this.spotifyService
  .addPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh,spotify:track:1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
    console.log('tracks added to playlist');
  });
```


#### Remove Tracks from a Playlist
Remove one or more tracks from a user’s playlist. Removing tracks from a public playlist requires the ```playlist-modify-public``` scope. Removing tracks from a private playlist requires the ```playlist-modify-private``` scope.
```ts
this.spotifyService.removePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```ts
this.spotifyService
  .removePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
    console.log('tracks removed from playlist');
  });
```

#### Reorder a Playlist's Tracks
Reorder a track or a group of tracks in a playlist.
```ts
this.spotifyService.reorderPlaylistTracks('user_id', 'playlist_id', options);
```
##### Options Object (Required)
- range_start - integer - Required. The position of the first track to be reordered.
- range_length - integer - Optional. The amount of tracks to be reordered. Defaults to 1 if not set.
- insert_before - integer - Required. The position where the tracks should be inserted.
- snapshot_id - string - Optional. The playlist's snapshot ID against which you want to make the changes.


Example:
```ts
this.spotifyService.reorderPlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', {
  range_start: 8,
  range_length: 5,
  insert_before: 0
}).subscirbe(data => {
  console.log(data);
});
```


#### Replace a Playlist’s Tracks
Replace all the tracks in a playlist, overwriting its existing tracks. This powerful request can be useful for replacing tracks, re-ordering existing tracks, or clearing the playlist. Replacing tracks in a public playlist requires the ```playlist-modify-public``` scope. Replacing tracks in a private playlist requires the ```playlist-modify-private``` scope.
```ts
this.spotifyService.replacePlaylistTracks('user_id', 'playlist_id', 'comma separated string or array of spotify track ids or uris');
```
Example:
```ts
this.spotifyService
  .replacePlaylistTracks('1176458919', '2TkWjGCu8jurholsfdWtG4', 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh, spotify:track:1301WleyT98MSxVHPZCA6M')
  .subscirbe(data => {
    console.log('tracks removed from playlist');
  });
```


#### Change a Playlist’s Details
Change a playlist’s name and public/private state. (The user must, of course, own the playlist.) Changing a public playlist requires the ```playlist-modify-public``` scope. Changing a private playlist requires the ```playlist-modify-private``` scope.
```ts
this.spotifyService.updatePlaylistDetails('user_id', 'playlist_id', options);
```
##### Options Object (Optional)
- name - string - Optional. The new name for the playlist, for example "My New Playlist Title".
- public - Boolean - Optional. If true the playlist will be public, if false it will be private.


Example:
```ts
this.spotifyService
  .updatePlaylistDetails('1176458919', '2TkWjGCu8jurholsfdWtG4', { name: 'Updated Playlist Title' })
  .subscirbe(data => {
    console.log('Updated playlist details');
  });
```


### User Profiles
User needs to be logged in to gain access to user profiles

#### Get a User’s Profile
Get public profile information about a Spotify user.
```ts
this.spotifyService.getUser('user_id');
```
Example:
```ts
this.spotifyService.getUser('wizzler').subscirbe(data => {
  console.log(data);
});
```


#### Get Current User’s Profile
Get detailed profile information about the current user (including the current user’s username).
```ts
this.spotifyService.getCurrentUser();
```
Example:
```ts
this.spotifyService.getCurrentUser().subscirbe(data => {
  console.log(data);
});
```


### Search
#### Search for an Item
Get Spotify catalog information about artists, albums, or tracks that match a keyword string.
```ts
this.spotifyService.search('Search Query', 'type', options);
```
- type - Required. A comma-separated list of item types to search across. Valid types are: album, artist, playlist, and track.

##### Options Object (Optional)
- limit - Optional. The maximum number of objects to return. Default: 20. Minimum: 1. Maximum: 50.
- offset - Optional. The index of the first object to return. Default: 0 (i.e., the first object). Use with limit to get the next set of objects.


Example:
```ts
this.spotifyService.search('Nirvana', 'artist').subscirbe(data => {
  console.log(data);
});
```


### Tracks
#### Get a Track
Get Spotify catalog information for a single track identified by its unique Spotify ID or Spotify URI.
```ts
this.spotifyService.getTrack('Track Id or Spotify Track URI');
```
Example:
```ts
this.spotifyService.getTrack('0eGsygTp906u18L0Oimnem').subscirbe(data => {
  console.log(data);
});
```

#### Get Several Tracks
Get Spotify catalog information for multiple tracks based on their Spotify IDs.
```ts
this.spotifyService.getTracks('Comma separated list or array of Track Ids');
```
Example:
```ts
this.spotifyService.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').subscirbe(data => {
  console.log(data);
});
```


### Authentication
#### Login
Will open login window. Requires user to initiate as it will open a pop up window.
Requires client id, callback uri and scope to be set in config.
```ts
this.spotifyService.login();
```

Example:
```ts
login() {
  this.spotifyService.login();
};
```

#### Example callback html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title></title>
  <script>
    window.onload = function () {
      var hash = window.location.hash;
      if (window.location.search.substring(1).indexOf("error") !== -1) {
        // login failure
        window.close();
      } else if (hash) {
        // login success
        var token = window.location.hash.split('&')[0].split('=')[1];
        localStorage.setItem('spotify-token', token);
      }
    }
  </script>
</head>
<body>

</body>
</html>
```




###Usage example

```shell
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
				authToken: localStorage.getItem('angular2-spotify-token')
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
```

---------------------------

Check out my [Playlist Manager](http://www.playlist-manager.com/) for Spotify
