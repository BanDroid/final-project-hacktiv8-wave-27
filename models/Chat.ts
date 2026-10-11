export interface Chat {
  id: string;
  text: string;
  isUser: boolean;
  media?: {
    filename: string;
    type: string;
    uri: string;
  };
}
