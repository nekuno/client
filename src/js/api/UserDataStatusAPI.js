import { fetchUserDataStatus } from '../utils/APIUtils';

export function getUserDataStatus(url = `data/status`) {
    return fetchUserDataStatus(url);
}