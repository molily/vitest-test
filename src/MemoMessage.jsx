import { h } from 'preact';
import { memo } from 'preact/compat';

/**
 * @type {import('preact').FunctionComponent<{
 * title: import('preact').ComponentChild,
 * children: import('preact').ComponentChildren
 * }>}
 */
export const MemoMessage = memo(({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
));
