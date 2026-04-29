import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.css'
})
export class ProfileCardComponent implements OnInit, OnDestroy {
  @ViewChild('songPreview')
  private songPreviewRef?: ElementRef<HTMLAudioElement>;

  protected readonly spotifyTrackUrl =
    'https://open.spotify.com/track/0RsH8g8DxdYZgdGcod5I36';
  protected readonly spotifyEmbedUrl =
    'https://open.spotify.com/embed/track/0RsH8g8DxdYZgdGcod5I36?utm_source=generator';
  protected readonly safeSpotifyEmbedUrl: SafeResourceUrl;

  protected readonly filters = [
    'All',
    'Songs',
    'Albums',
    'Playlists',
    'Artists',
    'Podcasts & Shows',
    'Profiles'
  ];

  protected readonly results = [
    {
      title: 'Bairan',
      subtitle: 'Album • Banjaare',
      tag: 'Album',
      artwork:
        'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/18/4e/43/184e43c9-0a9e-b12c-7f88-cf247f60e57f/196873009993.jpg/200x200bb.jpg'
    },
    {
      title: 'Sheesha - Aakhya Mai Aakh Ghali Jo Bairan',
      subtitle: 'Song • Mitta Ror, Swara Verma',
      tag: 'Song',
      artwork:
        'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Bairan - female version  💗 ✨',
      subtitle: 'Playlist • Artistto Haryanvi',
      tag: 'Playlist',
      artwork:
        'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/18/4e/43/184e43c9-0a9e-b12c-7f88-cf247f60e57f/196873009993.jpg/200x200bb.jpg'
    },
    {
      title: 'Khat',
      subtitle: 'Song • Navjot Ahuja',
      tag: 'Song',
      artwork:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Dooron Dooron',
      subtitle: 'Song • Paresh Pahuja, Shiv Tandan, Meghdeep Bose',
      tag: 'Song',
      artwork:
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&q=80'
    },
    {
      title: 'Trending Insta Reels 2026',
      subtitle: 'Playlist • Viral Punjabi Cuts',
      tag: 'Playlist',
      artwork:
        'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80'
    }
  ];

  protected track = {
    title: 'Bairan',
    artist: 'Banjaare',
    subtitle: 'Song • Banjaare',
    artwork:
      'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/18/4e/43/184e43c9-0a9e-b12c-7f88-cf247f60e57f/196873009993.jpg/400x400bb.jpg',
    duration: '2:30',
    releasedOn: 'January 23, 2026',
    previewUrl: ''
  };

  protected activeFilter = 'All';
  protected isPlaying = false;
  protected isLoadingPreview = true;
  protected previewReady = false;
  protected statusText = 'Loading song preview...';

  constructor(private readonly domSanitizer: DomSanitizer) {
    this.safeSpotifyEmbedUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.spotifyEmbedUrl
    );
  }

  async ngOnInit(): Promise<void> {
    await this.loadTrackPreview();
  }

  ngOnDestroy(): void {
    this.stopPlayback();
  }

  protected setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  protected async togglePlayback(): Promise<void> {
    if (this.isPlaying) {
      this.stopPlayback();
      return;
    }

    const audio = this.songPreviewRef?.nativeElement;
    if (!audio || !this.previewReady) {
      return;
    }

    await audio.play();
    this.isPlaying = true;
    this.statusText = 'Playing Bairan preview';
  }

  protected handleEnded(): void {
    this.isPlaying = false;
    this.statusText = 'Preview ended. Tap play again.';
  }

  protected openSpotifyTrack(): void {
    window.open(this.spotifyTrackUrl, '_blank', 'noopener,noreferrer');
  }

  private stopPlayback(): void {
    const audio = this.songPreviewRef?.nativeElement;
    if (!audio) {
      this.isPlaying = false;
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    this.isPlaying = false;
  }

  private async loadTrackPreview(): Promise<void> {
    try {
      const response = await fetch(
        'https://itunes.apple.com/search?term=Bairan%20Banjaare&entity=song&limit=1'
      );
      const payload = (await response.json()) as {
        results?: Array<{
          artistName?: string;
          artworkUrl100?: string;
          previewUrl?: string;
          releaseDate?: string;
          trackName?: string;
          trackTimeMillis?: number;
        }>;
      };
      const firstResult = payload.results?.[0];

      if (!firstResult?.previewUrl) {
        throw new Error('Preview URL unavailable');
      }

      this.track = {
        title: firstResult.trackName ?? this.track.title,
        artist: firstResult.artistName ?? this.track.artist,
        subtitle: `Song • ${firstResult.artistName ?? this.track.artist}`,
        artwork:
          firstResult.artworkUrl100?.replace('100x100bb', '400x400bb') ??
          this.track.artwork,
        duration: this.formatDuration(firstResult.trackTimeMillis),
        releasedOn: this.formatReleaseDate(firstResult.releaseDate),
        previewUrl: firstResult.previewUrl
      };

      this.results[0] = {
        ...this.results[0],
        subtitle: `Album • ${this.track.artist}`,
        artwork: this.track.artwork
      };

      this.previewReady = true;
      this.statusText = 'Preview ready. Tap play, or use the Spotify player below.';
    } catch {
      this.previewReady = false;
      this.statusText = 'Preview unavailable here. Use the Spotify player below.';
    } finally {
      this.isLoadingPreview = false;
    }
  }

  private formatDuration(trackTimeMillis?: number): string {
    if (!trackTimeMillis) {
      return this.track.duration;
    }

    const totalSeconds = Math.round(trackTimeMillis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private formatReleaseDate(releaseDate?: string): string {
    if (!releaseDate) {
      return this.track.releasedOn;
    }

    return new Date(releaseDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
}
