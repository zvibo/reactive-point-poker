import 'babel-polyfill';

import w from 'window';
import conductor from './conductor';

conductor(w.data || {});
