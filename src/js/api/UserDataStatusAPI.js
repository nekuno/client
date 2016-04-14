import { fetchUserDataStatus } from '../utils/APIUtils';

export function getUserDataStatus(userId, url = `data/status`) {
    return fetchUserDataStatus(url);
}