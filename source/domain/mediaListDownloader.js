const mediaListDownloader = async (store, iterator) => {
  while(!(mediaIteratee = await iterator.next()).done) {
    await store.addMedia(mediaIteratee.value);
  }
};

module.exports = mediaListDownloader;