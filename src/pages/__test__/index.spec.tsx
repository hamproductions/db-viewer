import { describe, expect, it } from 'vitest';
import { Page } from '../index/+Page';
import { render } from '~/__test__/utils';

describe.skip('Home page', () => {
  it('renders', async () => {
    const [{ container }] = await render(<Page />);
    expect(container).toBeDefined();
  });
});
