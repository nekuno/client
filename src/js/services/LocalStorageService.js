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

    getObjectProperty(key, property) {
        const storedString = this.get(key);
        const storedObject = JSON.parse(storedString);

        return storedObject ? storedObject[property] || null : null;
    }

    setObjectProperty(key, property, value = true) {
        const storedString = this.get(key);
        let storedObject = JSON.parse(storedString) || {};
        storedObject[property] = value;
        this.set(key, JSON.stringify(storedObject));
    }
}

export default new LocalStorageService();