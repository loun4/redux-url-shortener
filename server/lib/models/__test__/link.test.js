
const test = require('ava');
const { start, stop } = require('../../setup-test');
const linkPackage = require('../link');

test.before(start);

test('Hydrate from raw data', (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = new Link({ $loki: 1, linkURL: 'http://www.google.fr' });

  t.deepEqual(model.toJSON(), {
    id: '6XIv',
    visit: 0,
    linkURL: 'http://www.google.fr',
    meta: { created: null },
  });
});

test('Increment visits', (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = new Link({ $loki: 1, linkURL: 'http://www.google.fr' });
  model.incrementVisit();

  t.is(model.toJSON().visit, 1);
});

test('Create', async (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.google.fr' }).create();

  t.truthy(model.toJSON().id);
  t.is(model.toJSON().linkURL, 'http://www.google.fr');
});

test('Update', async (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.google.fr' }).create();
  await model.incrementVisit().update();

  t.is(model.toJSON().visit, 1);
});

test('Delete', async (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.link1.com' }).create();
  await model.remove();

  const entry = t.context.db.getCollection('links').findOne({ linkURL: 'http://www.link1.com' });
  t.is(entry, null);
});

test('Convert to db document', async (t) => {
  const { Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.link2.com' }).create();
  const expectedDoc = {
    $loki: model.rawId,
    visit: model.toJSON().visit,
    linkURL: model.toJSON().linkURL,
    meta: model.toJSON().meta,
  };

  t.deepEqual(model.toDbDocument(), expectedDoc);
});

test('Load by id', async (t) => {
  const { loadById, Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.link3.com' }).create();
  const requestedModel = await loadById(model.rawId);

  t.deepEqual(model, requestedModel);
});

test('Load by linkURL', async (t) => {
  const { loadByLinkURL, Link } = linkPackage(t.context.db);
  const model = await new Link({ linkURL: 'http://www.link4.com' }).create();
  const requestedModel = await loadByLinkURL(model.toJSON().linkURL);

  t.deepEqual(model, requestedModel);
});

test('Load links', async (t) => {
  const { loadLinks, Link } = linkPackage(t.context.db);
  await new Link({ linkURL: 'http://www.link5.com' }).create();
  const requestedModels = await loadLinks();

  t.truthy(requestedModels.length);
});

test.after(stop);
