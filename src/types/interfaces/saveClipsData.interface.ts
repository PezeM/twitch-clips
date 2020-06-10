import { HelixClipExtended } from './helixClipExtended.interface';

export interface ISaveClipsDataService {
  saveClips(userName: string, clips: HelixClipExtended[]): Promise<boolean>;
}
