declare module '*/manifest.json' {
  interface FillerComment {
    username: string;
    text: string;
    timestamp: number;
  }

  interface MediaItem {
    id: string;
    type: 'image' | 'video';
    filename: string;
    caption: string;
    roast_line?: string;
    show_subtitle?: boolean;
    fillerComments?: FillerComment[];
  }

  const value: MediaItem[];
  export default value;
}
