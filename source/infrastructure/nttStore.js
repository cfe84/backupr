const ntt = require("nttjs");
const mediaType = require("../domain/enum/mediaType");

const keys = {
  mediaById: "mediaById",
  photosDownloadQueue: "photosDownloadQueue"
};

const nttStore = async (adapter) => {
  const rootEntity = await ntt.entity(adapter);
  const mediaByIdResource = await rootEntity.createResource(keys.mediaById);
  const photosDownloadQueueResource = await rootEntity.createResource(keys.photosDownloadQueue);

  const updateMedia = (media) => {
    media.status = {
      downloaded: false
    };
    return media;
  };

  const store = {
    addMedia: async (mediaData) => {
      mediaData = updateMedia(mediaData);
      const mediaByIdEntity = await mediaByIdResource.createEntity(mediaData.id);
      await mediaByIdEntity.save(mediaData);
      if (mediaData.type === mediaType.photo) {
        const photoQueue = await photosDownloadQueueResource.createEntity(mediaData.id);
        photoQueue.save(mediaData);
      }
    },
    getPhotosDownloadQueueIterator: async () => {
      const photosDownloadIterator = await photosDownloadQueueResource.iterateEntities();
      const iterator = {
        next: async () => {
          const {done, value} = await photosDownloadIterator.next();
          let content;
          if (!done) {
            content = await value.load();
          }
          const element = {
            value: content,
            done: done
          };
          return element;
        }
      };
      return iterator;
    }
  };
  return store;
};

module.exports = nttStore;