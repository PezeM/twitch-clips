import { HelixUser, HelixClip } from 'twitch';
import { twitchApi } from './twitchApi';
import { delay } from './helpers/utils';
import { Config } from './configs/config';
import { ClipTransformService } from './services/clipTransformService';
import { SaveClipsToFileService } from './services/saveClipsToFileService';
import { ISaveClipsDataService } from './types/interfaces/saveClipsData.interface';
import { writeFileSync } from 'fs';

export class GatherClipsData {
  public readonly userName: string;
  private user: HelixUser;
  private nextClips: boolean;
  private startDate: Date;
  private nextDate: Date;
  private clipTransformService: ClipTransformService;
  private saveClipsDataService: ISaveClipsDataService;
  private clipsData: any;

  constructor(userName: string) {
    this.userName = userName;
    this.startDate = Config.startDate;
    this.clipsData = [];
    this.clipTransformService = new ClipTransformService();
    this.saveClipsDataService = new SaveClipsToFileService();
  }

  async getAllClipsDataForUser() {
    const startTime = Date.now();
    if (!this.user) await this.getUser();

    do {
      try {
        this.nextClips = await this.makeClipsRequest();
      } catch (error) {
        console.log(`ERROR: ${error}`);
        await delay(1000);
      }
    } while (this.nextClips);

    writeFileSync(
      `clips_${this.userName}.json`,
      JSON.stringify(this.clipsData, null, 2),
    );
    const endTime = Date.now();
    console.log(
      `Finished gathering all clips data for user ${this.userName} in ${
        (endTime - startTime) / 1000
      }s.`,
    );
  }

  private async makeClipsRequest(): Promise<boolean> {
    this.nextDate = this.getEndClipsDate(this.startDate);
    console.log(`Making request`, this.startDate, this.nextDate);
    const clipsData = await twitchApi.getUserClips(
      this.user,
      this.startDate,
      this.nextDate,
    );

    if (
      (!clipsData || clipsData.length <= 0) &&
      this.nextDate.getTime() > Date.now()
    ) {
      return false;
    }

    console.log(
      `Fetched ${
        clipsData.length
      } clips from ${this.startDate.toLocaleDateString()} to ${this.nextDate.toLocaleDateString()}`,
    );

    const clips = this.clipTransformService.addExtraDataToClip(clipsData);
    // if (!(await this.saveClipsDataService.saveClips(this.userName, clips))) {
    //     console.error(`Error while saving clips.`);
    // }

    this.clipsData.push(...clips);
    this.startDate = this.generateNextStartDate(clipsData);

    return true;
  }

  private async getUser() {
    if (!this.userName || this.userName.length <= 0)
      throw new Error(`Passed userName to gatherClipsData is empty or undefined.`);

    const user = await twitchApi.getUserByName(this.userName);
    if (!user)
      throw new Error(
        `Username with name ${this.userName} is not correct twitch.tv account.`,
      );

    this.user = user;
  }

  private getEndClipsDate(startDate: Date) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Config.nextRequestDays);

    return endDate;
  }

  private generateNextStartDate(clipsData: HelixClip[]): Date {
    const lastClipDate =
      clipsData.length > 0
        ? clipsData[clipsData.length - 1].creationDate
        : undefined;

    if (lastClipDate && lastClipDate.getTime() > this.nextDate.getTime()) {
      return lastClipDate;
    } else {
      return this.nextDate;
    }
  }
}
