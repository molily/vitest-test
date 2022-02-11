import { render } from '@testing-library/svelte';
import { expect, it } from 'vitest';

import Counter from './Counter.svelte';

it('renders the count', () => {
  const { getByText } = render(Counter);

  expect(getByText('0')).toBeDefined();
});