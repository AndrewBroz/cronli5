// Browser entry: attach the default export to the global so a plain
// `<script>` include exposes a callable `cronli5`.
import cronli5 from './cronli5.js';

if (typeof globalThis !== 'undefined') {
  globalThis.cronli5 = cronli5;
}

export default cronli5;
