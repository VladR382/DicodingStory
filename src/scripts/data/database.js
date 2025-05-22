import { openDB } from 'idb';

const DATABASE_NAME = 'dicoding-story-db';
const DATABASE_VERSION = 2;
const OBJECT_STORE_NAME = 'saved-stories';  

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade: (database, oldVersion) => {
        if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
            database.createObjectStore(OBJECT_STORE_NAME, {
                keyPath: 'id',
            });
        }
    },
});

export const saveStory = async (storyData) => {
    if (!storyData.id) throw new Error("ID cerita tidak valid");
    
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    await store.put(storyData);
    return tx.complete;
};

export const getStory = async (id) => { 
    const db = await dbPromise;
    return db.get(OBJECT_STORE_NAME, id);
};

export const getAllStories = async () => { 
    const db = await dbPromise;
    return db.getAll(OBJECT_STORE_NAME);
};

export const deleteStory = async (id) => { 
    const db = await dbPromise;
    const tx = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const store = tx.objectStore(OBJECT_STORE_NAME);
    await store.delete(id);
    return tx.complete;
};