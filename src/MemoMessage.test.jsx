import { render } from '@testing-library/preact';
import { h } from 'preact';
import { expect, it } from 'vitest';

import { MemoMessage } from './MemoMessage';

it('renders the title and children', () => {
  const title = 'Hi';
  const text = 'Ho';

  const { getByText } = render(
    <MemoMessage title={title}>
      <p>{text}</p>
    </MemoMessage>
  );

  expect(getByText(title)).toBeTruthy();
  expect(getByText(text)).toBeTruthy();
});
