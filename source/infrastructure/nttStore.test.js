const should = require("should");
const ntt = require("nttjs");
const nttStore = require("./nttStore");
const mediaType = require("../domain/enum/mediaType");

const generateTestMediaData = (mediaType) => {
  return { id: `${Math.floor(Math.random() * 100)}`, type: mediaType, stuff: "things" };
};

describe("nttStore", () => {
  it("is saving photo data", async () => {
    const adapter = ntt.adapters.inMemory();
    const store = await nttStore(adapter);
    const testMediaData = generateTestMediaData(mediaType.photo);
    await store.addMedia(testMediaData);
    const rootEntity = ntt.entity(adapter);
    const mediaByIdResource = await rootEntity.getResource("mediaById");
    const mediaByIdEntity = await mediaByIdResource.getEntity(testMediaData.id);
    const mediaByIdContent = await mediaByIdEntity.load();

    should(mediaByIdContent).not.be.undefined();
    mediaByIdContent.id.should.equal(testMediaData.id);
    mediaByIdContent.stuff.should.equal(testMediaData.stuff);
    should(mediaByIdContent.status).not.be.undefined();
    should(mediaByIdContent.type).equal(mediaType.photo);
    should(mediaByIdContent.status.downloaded).be.false();
  });

  it("is putting photos in download queue", async () => {
    const adapter = ntt.adapters.inMemory();
    const store = await nttStore(adapter);
    const testMediaData = generateTestMediaData(mediaType.photo);
    await store.addMedia(testMediaData);

    const queueIterator = await store.getPhotosDownloadQueueIterator();
    const photo = await queueIterator.next();
    photo.done.should.be.false();
    photo.value.id.should.equal(testMediaData.id);
    (await queueIterator.next()).done.should.be.true();
  });
});