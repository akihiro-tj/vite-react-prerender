import { createRoot, hydrateRoot } from 'react-dom/client';
import { apps } from '../common/config';

apps.forEach(({ id, Content }) => {
  const root = document.getElementById(id);

  import.meta.env.DEV
    ? createRoot(root).render(<Content />)
    : hydrateRoot(root, <Content />);
});
