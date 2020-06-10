import { HelixClip } from 'twitch';

export interface HelixClipExtended extends HelixClip {
  clipId: string;
  sourceURL: string;
}
