import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getAriaCurrent, getNavigationState } from '../../src/utils/navigation.ts';

describe('navigation state', () => {
  it('marks only an exact destination as the current page', () => {
    assert.equal(getNavigationState('/blog/', '/blog/'), 'current');
    assert.equal(getAriaCurrent('current'), 'page');
  });

  it('marks a parent section as an ancestor on nested pages', () => {
    assert.equal(getNavigationState('/blog/personal/cats/post/', '/blog/'), 'ancestor');
    assert.equal(getNavigationState('/blog/personal/cats/post/', '/blog/personal/'), 'ancestor');
    assert.equal(getAriaCurrent('ancestor'), 'true');
  });

  it('does not match paths that merely share a prefix', () => {
    assert.equal(getNavigationState('/blogging/', '/blog/'), 'inactive');
    assert.equal(getNavigationState('/projects-archive/', '/projects/'), 'inactive');
    assert.equal(getAriaCurrent('inactive'), undefined);
  });

  it('normalizes missing leading and trailing slashes', () => {
    assert.equal(getNavigationState('blog/personal', '/blog/personal/'), 'current');
  });

  it('does not treat the homepage as an ancestor of every route', () => {
    assert.equal(getNavigationState('/blog/', '/'), 'inactive');
    assert.equal(getNavigationState('/fi/projektit/', '/fi/', true), 'inactive');
    assert.equal(getNavigationState('/fi/', '/fi/', true), 'current');
  });
});
