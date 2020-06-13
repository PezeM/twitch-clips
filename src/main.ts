import { GatherClipsData } from './gatherClipsData';

const userName = process.argv[2];
const gatherClipsData = new GatherClipsData(userName);
gatherClipsData.getAllClipsDataForUser();
