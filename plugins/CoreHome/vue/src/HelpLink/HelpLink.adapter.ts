/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import createAngularJsAdapter from '../createAngularJsAdapter';
import HelpLink from './HelpLink.vue';

export default createAngularJsAdapter({
  component: HelpLink,
  scope: {
    base: {
      angularJsBind: '@?',
    },
    keyword: {
      angularJsBind: '@?',
    },
    text: {
      angularJsBind: '@?',
    },
  },
  directiveName: 'matomoHelpLink',
});
