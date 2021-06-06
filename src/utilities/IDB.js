// create indexedDB stores 
const dbPromise = idb.openDB("store", 1, {
    // create stores if they don't exist
    upgrade(db) {
      if(!db.objectStoreNames.contains("sync-messages")) {
        db.createObjectStore("sync-messages");
      }
      if(!db.objectStoreNames.contains("user-settings")) {
        db.createObjectStore("user-settings");
      }
      if(!db.objectStoreNames.contains("unread-messages")) {
        db.createObjectStore("unread-messages");
      }
    }
  });
  
  // helper class for easy access to indexedDB
  class IDB {
    static async get(store, key) {
      return (await dbPromise).get(store, key);
    }
    static async getAll(store) {
      return (await dbPromise).getAll(store);
    }
    static async add(store, val) {
      val.uuid = uuid();
      return this.set(store, val.uuid, val);
    }
    static async set(store, key, val) {
      return (await dbPromise).put(store, val, key);
    }
    static async remove(store, key) {
      return (await dbPromise).delete(store, key);
    }
    static async clear(store) {
      return (await dbPromise).clear(store);
    }
    static async keys(store) {
      return (await dbPromise).getAllKeys(store);
    }
  }
  
  // helper function to generate uuid
  function uuid(length = 10) {
    let dt = new Date().getTime();
    let uuid = 'x'.repeat(length).replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }
  
  uuid()   - "bc019b150f"
  uuid(15) - "b6fd9a0d671ace7"
  uuid(25) - "b5ade215e5af303717c29919e"