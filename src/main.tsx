import ReactDOM from 'react-dom/client';
import Logger, { type LoggerCls } from '@ezuikit/utils-logger';
import Page from './page';
import '@/i18n/i18n';
import './index.css';
import { ErrorBoundary } from './components/pages';

const logger: LoggerCls = Logger({
  level: import.meta.env.PROD ? 'ERROR' : 'INFO',
  name: 'RATS',
  showTime: true,
});

/** global logger */
window.logger = logger;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <Page />
  </ErrorBoundary>,
  // </React.StrictMode>
);
