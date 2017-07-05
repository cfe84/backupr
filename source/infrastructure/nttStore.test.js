const should = require("should");
const nttStore = require("./nttStore");
const ntt = require("nttjs");

const generateTestMediaData = () => {
  return { id: `${Math.floor(Math.random() * 100)}`, stuff: "things" };
};

describe("nttStore", () => {
  it("is saving media data", async () => {
    const adapter = ntt.adapters.inMemory();
    const store = await nttStore(adapter);
    const testMediaData = generateTestMediaData();
    await store.addMedia(testMediaData);
    const rootEntity = ntt.entity(adapter);
    const resource = await rootEntity.getResource("mediaById");
    const entity = await resource.getEntity(testMediaData.id);
    const entityContent = await entity.load();

    should(entityContent).not.be.undefined();
    entityContent.id.should.equal(testMediaData.id);
    entityContent.stuff.should.equal(testMediaData.stuff);
    should(entityContent.status).not.be.undefined();
    should(entityContent.status.downloaded).be.false();
  });
});