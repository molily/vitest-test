import { render } from '@testing-library/preact';
import { h } from 'preact';
import { expect, it } from 'vitest';

import { Counter } from './Counter';

it('renders the count', () => {
  const { getByText } = render(<Counter />);

  expect(getByText('0')).toBeDefined();
});
