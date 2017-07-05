const ntt = require("nttjs");

const keys = {
  mediaById: "mediaById"
};

const nttStore = async (adapter) => {
  const rootEntity = await ntt.entity(adapter);
  const mediaByIdResource = await rootEntity.createResource(keys.mediaById);

  const updateMedia = (media) => {
    media.status = {
      downloaded: false
    };
    return media;
  };

  const store = {
    addMedia: async (mediaData) => {
      mediaData = updateMedia(mediaData);
      const entity = await mediaByIdResource.createEntity(mediaData.id);
      await entity.save(mediaData);
    }
  };
  return store;
};

module.exports = nttStore;