export interface HistoryItem {
  id: string;
  text: string;
  voice: string;
  emotion: string;
  color: string;
  speed: number;
  pitch: number;
  time: string;
  audioUrl: string;
}

export interface LogEntry {
  id: string;
  time: string;
  type: 'info' | 'error' | 'request' | 'response';
  message: string;
}
