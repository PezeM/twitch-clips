import { HelixClip } from 'twitch';
import { HelixClipExtended } from '../types/interfaces/helixClipExtended.interface';

const CLIP_MEDIA_SERVER_URL = 'https://clips-media-assets2.twitch.tv/';

export class ClipTransformService {
  addExtraDataToClip(clipsData: HelixClip[]): HelixClipExtended[] {
    for (const clip of clipsData) {
      const clipId = this.getIdFromClip(clip);
      (clip as HelixClipExtended).clipId = clipId;
      (clip as HelixClipExtended).sourceURL = ClipTransformService.getSourceUrl(clipId);
    }

    return clipsData as HelixClipExtended[];
  }

  getIdFromClip(clip: HelixClip) {
    if (!clip) throw new Error('Passed null clip');

    return clip.thumbnailUrl.substring(
      clip.thumbnailUrl.lastIndexOf('twitch.tv') + 10,
      clip.thumbnailUrl.lastIndexOf('preview') - 1,
    );
  }

  static getSourceUrl(clipId: string) {
    return CLIP_MEDIA_SERVER_URL + '/' + clipId + '.mp4';
  }
}
