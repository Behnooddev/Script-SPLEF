# Spotify Playlist Extractor

A browser-console JavaScript utility for extracting the complete track list from a Spotify playlist.

Spotify's web player uses lazy loading and virtualized playlist rows, which means only a portion of a large playlist may exist in the DOM at any given time. This script automatically scrolls through the playlist, collects visible tracks, removes duplicates, and generates a complete text list.

## Features

* Extracts tracks from large Spotify playlists
* Handles Spotify's virtualized playlist interface
* Automatically scrolls through the playlist
* Collects track titles and artists
* Removes duplicate tracks using Spotify track URLs
* Preserves the order in which tracks are encountered
* Copies the final result to the browser clipboard
* Requires no external libraries or installations
* Runs directly inside the browser Developer Console

## Requirements

* A desktop browser
* Spotify Web Player
* Access to the playlist you want to extract
* Browser Developer Tools

The script is intended for Spotify's current web player interface and may require changes if Spotify modifies its DOM structure.

## Usage

1. Open Spotify Web Player in your browser.
2. Open the playlist you want to extract.
3. Open Developer Tools.

For Chromium-based browsers, you can usually press:

```text
F12
```

or:

```text
Ctrl + Shift + J
```

4. Open the `Console` tab.
5. Paste the script from this repository into the console.
6. Run it.
7. Wait while the script scrolls through the playlist and collects tracks.
8. When extraction is complete, the console will display the total number of tracks found.

The extracted result is also stored in:

```js
window.spotifyPlaylistResult
```

To copy the result to your clipboard, run:

```js
navigator.clipboard.writeText(spotifyPlaylistResult)
```

## Output Format

The generated output follows this format:

```text
1. Track Name — Artist
2. Track Name — Artist
3. Track Name — Artist
```

For tracks with multiple artists:

```text
1. Track Name — Artist One, Artist Two
```

## How It Works

The script identifies the scrollable container used by Spotify's playlist interface.

It then repeatedly:

1. Collects currently visible playlist rows.
2. Finds Spotify track URLs.
3. Extracts the track title.
4. Extracts the associated artist names.
5. Uses the track URL as a unique identifier.
6. Scrolls further down the playlist.
7. Repeats the process until the bottom of the playlist is reached.

Because Spotify dynamically renders playlist rows, collecting tracks only once with `querySelectorAll()` may return an incomplete list. The continuous scrolling approach allows the script to capture tracks as they are rendered.

## Duplicate Handling

Tracks are stored in a JavaScript `Map`.

The Spotify track URL is used as the unique identifier:

```js
const trackId = trackLink.href.split("?")[0];
```

This prevents the same track from being added multiple times while the playlist is being scrolled.

## Limitations

This script depends on Spotify's current web-player DOM structure.

Spotify may change:

* Element attributes
* Playlist row structure
* Scroll containers
* Track link structure
* Artist link structure

If Spotify changes its interface, the selectors used by the script may need to be updated.

The script extracts information available in the Spotify Web Player interface. It does not access Spotify's private APIs or modify the playlist.

## Privacy

The script runs locally in the browser.

It does not send the extracted playlist data to an external server.

The extracted data remains available in the current browser page through:

```js
window.spotifyPlaylistResult
```

Refreshing or closing the page will remove this variable.

## Project Structure

```text
spotify-playlist-extractor/
├── README.md
└── spotify-playlist-extractor.js
```

## License

Copyright (c) 2026 Behnood Shafiei (Behnooddev) (VoidRoot)

Developer: Behnood Shafiei

This project is provided for personal and educational use.

## Disclaimer

This project is an independent browser-side utility and is not affiliated with or endorsed by Spotify.

Use the tool in accordance with Spotify's Terms of Use and applicable laws.
