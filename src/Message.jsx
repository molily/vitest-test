import { h } from 'preact';

/**
 * @type {import('preact').FunctionComponent<{
 * title: import('preact').ComponentChild,
 * children: import('preact').ComponentChildren
 * }>}
 */
export const Message = ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);
