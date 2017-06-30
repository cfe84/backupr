const should = require("should");
const mediaListDownloader = require("./downloadMediaLIst");

const createFakeStore = () => {
  let lastIndex;
  let mediaList = [];
  const fakeStore = {
    addMedia: (mediaData) => {
      mediaList.push(mediaData);
      return Promise.resolve();
    },
    _getMediaList: () => mediaList
  };
  return fakeStore;
};

const createFakeMediaIterator = () => {
  const media = [];
  let index = 0;
  const fakeMediaIterator = {
    next: () => {
      let value = index < media.length ? media[index++] : undefined;
      return Promise.resolve({
        value: value,
        done: !value
      });
    },
    _getDone: () => index >= media.length
  };
  return fakeMediaIterator;
};

describe("Download media list", () => {
  const store = createFakeStore();
  const iterator = createFakeMediaIterator();
  const downloader = mediaListDownloader(store, iterator);

  before = () => downloader.download();

  it("Stores the media list", () => {

  });
  
  it("Downloads till the end", () => {
    iterator._getDone().should.be.true();
  });
});