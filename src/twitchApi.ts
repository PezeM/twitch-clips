import TwitchClient, { AccessToken, HelixUser } from 'twitch';
import { writeFileSync } from 'fs';
import { Config } from './configs/config';

class TwitchApi {
  public readonly twitchClient: TwitchClient;

  constructor() {
    const { clientId, accessToken, clientSecret, refreshToken } = Config;

    this.twitchClient = TwitchClient.withCredentials(
      clientId,
      accessToken,
      undefined,
      {
        clientSecret,
        refreshToken,
        onRefresh: (token: AccessToken) => {
          console.log('New access token', token);
          writeFileSync('token.json', JSON.stringify(token));
        },
      },
    );
  }

  async getUserByName(name: string) {
    return this.twitchClient.helix.users.getUserByName(name);
  }

  async getUserClips(user: HelixUser, startDate: Date, endDate: Date) {
    const request = this.twitchClient.helix.clips.getClipsForBroadcasterPaginated(
      user.id,
      {
        endDate: endDate.toISOString(),
        startDate: startDate.toISOString(),
        limit: 100,
      },
    );

    return await request.getAll();
  }
}

export const twitchApi = new TwitchApi();
