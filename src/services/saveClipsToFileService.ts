import { ISaveClipsDataService } from '../types/interfaces/saveClipsData.interface';
import { HelixClipExtended } from '../types/interfaces/helixClipExtended.interface';
import { readFileSync, writeFileSync } from 'fs';

export class SaveClipsToFileService implements ISaveClipsDataService {
    async saveClips(userName: string, clips: HelixClipExtended[]): Promise<boolean> {
        try {
            const existingData = readFileSync(`clips_${userName}.json`, {
                flag: 'a+'
            });
            
            const data = existingData.length > 0 ? JSON.parse(existingData.toString()) as HelixClipExtended[] : [];
            data.push(...clips);
            writeFileSync(`clips_${userName}.json`, JSON.stringify(data, null, 2));

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}