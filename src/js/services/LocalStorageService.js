class LocalStorageService {
    get(key) {
        return localStorage.getItem(key) || null;
    }

    set(key, value = true) {
        localStorage.setItem(key, value);
    }

    remove(key) {
        localStorage.removeItem(key);
    }
}

export default new LocalStorageService();