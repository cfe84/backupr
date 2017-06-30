const should = require("should");
const mediaListDownloader = require("./mediaListDownloader");

const createFakeStore = () => {
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
  const media = [
    { id: 0, name: "sdkfjdofigeogioefdmbd" },
    { id: 1, name: "dsfkljsw999m4nnd" },
    { id: 3, name: "dfjr393mmvsvmslvbd[q[k0fkfmbkd" }
  ];
  let index = 0;
  const fakeMediaIterator = {
    next: () => {
      let done = index >= media.length;
      let value = !done ? media[index++] : undefined;
      return Promise.resolve({
        value: value,
        done: !value
      });
    },
    _getDone: () => index >= media.length,
    _getMediaList: () => media
  };
  return fakeMediaIterator;
};

describe("Download media list", () => {
  const store = createFakeStore();
  const iterator = createFakeMediaIterator();
  const downloader = mediaListDownloader(store, iterator);

  before = () => downloader.download();

  it("Stores the media list", () => {
    const expectedList = iterator._getMediaList();
    const actualList = store._getMediaList();
    actualList.length.should.equal(expectedList.length);
    for(i = 0; i < actualList.length; i++) {
      const expected = expectedList[i];
      const actual = actualList[i];
      actual.id.should.equal(expected.id);
    }
  });

  it("Downloads till the end", () => {
    iterator._getDone().should.be.true();
  });
});