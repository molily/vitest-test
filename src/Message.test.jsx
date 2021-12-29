import { render } from '@testing-library/preact';
import { h } from 'preact';
import { expect, it } from 'vitest';

import { Message } from './Message';

it('renders the title and children', () => {
  const title = 'Hi';
  const text = 'Ho';

  const { getByText } = render(
    <Message title={title}>
      <p>{text}</p>
    </Message>
  );

  expect(getByText(title)).toBeTruthy();
  expect(getByText(text)).toBeTruthy();
});
