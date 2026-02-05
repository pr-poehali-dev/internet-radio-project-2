export interface Track {
  id: number;
  title: string;
  artist: string;
  time: string;
  duration: string;
}

export interface Schedule {
  id: number;
  time: string;
  dj: string;
  genre: string;
  isLive: boolean;
}

export interface Podcast {
  id: number;
  title: string;
  episode: string;
  duration: string;
  plays: string;
}

export interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

export interface CurrentTrack {
  title: string;
  artist: string;
  genre: string;
  listeners: number;
}
