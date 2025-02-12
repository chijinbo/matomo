/*!
 * Matomo - free/libre analytics platform
 *
 * @link https://matomo.org
 * @license http://www.gnu.org/licenses/gpl-3.0.html GPL v3 or later
 */

import jqXHR = JQuery.jqXHR;
import { IAngularStatic, IScope } from 'angular';
import { ExtendedKeyboardEvent } from 'mousetrap';

declare global {
  type QueryParameterValue = string | number | null | undefined | QueryParameterValue[];
  type QueryParameters = {[name: string]: QueryParameterValue | QueryParameters};

  interface WrappedEventListener extends Function {
    wrapper?: (evt: Event) => void;
  }

  /**
   * global ajax queue
   *
   * @type {Array} array holding XhrRequests with automatic cleanup
   */
  interface GlobalAjaxQueue extends Array<XMLHttpRequest|null> {
    active:number;

    /**
     * Removes all finished requests from the queue.
     *
     * @return {void}
     */
    clean();

    /**
     * Extend Array.push with automatic cleanup for finished requests
     *
     * @return {Object}
     */
    push(...args: (XMLHttpRequest|jqXHR|null)[]);

    /**
     * Extend with abort function to abort all queued requests
     *
     * @return {void}
     */
    abort();
  }

  interface PiwikPopoverGlobal {
    isOpen();
    close();
    setTitle(title: string): void;
    setContent(html: string|HTMLElement|JQuery|JQLite): void;
    showLoading(loadingName: string, popoverSubject?: string, height?: number, dialogClass?: string): JQuery;
    onClose(fn: () => void);
  }

  let Piwik_Popover: PiwikPopoverGlobal;

  interface ModalConfirmCallbacks {
    yes?: () => void;
    no?: () => void;
    validation?: () => void;
  }

  interface ModalConfirmOptions {
    onCloseEnd: () => void;
  }

  interface CompileAngularComponentsOptions {
    scope?: IScope;
    forceNewScope?: boolean;
    params?: Record<string, unknown>;
  }

  interface PiwikHelperGlobal {
    escape(text: string): string;
    redirect(params: any);
    htmlDecode(encoded: string): string;
    htmlEntities(value: string): string;
    modalConfirm(element: JQuery|JQLite|HTMLElement|string, callbacks?: ModalConfirmCallbacks, options?: ModalConfirmOptions);
    getAngularDependency(eventName: string): any;
    isAngularRenderingThePage(): boolean;
    setMarginLeftToBeInViewport(elementToPosition: JQuery|JQLite|Element|string): void;
    lazyScrollTo(element: JQuery|JQLite|HTMLElement|string, time: number, forceScroll?: boolean): void;
    lazyScrollToContent(): void;
    registerShortcut(key: string, description: string, callback: (event: ExtendedKeyboardEvent) => void): void;
    compileAngularComponents(selector: JQuery|JQLite|HTMLElement|string, options?: CompileAngularComponentsOptions): void;
    calculateEvolution(currentValue: number, pastValue?: number|null): number;
    sendContentAsDownload(filename: string, content: any, mimeType?: string): void;
  }

  let piwikHelper: PiwikHelperGlobal;

  interface BroadcastGlobal {
    getValueFromUrl(paramName: string, url?: string): string;
    getValuesFromUrl(paramName: string, decode?: boolean): QueryParameters;
    getValueFromHash(paramName: string, url?: string): string;
    isWidgetizeRequestWithoutSession(): boolean;
    updateParamValue(newParamValue: string, urlStr: string): string;
    propagateNewPage(str?: string, showAjaxLoading?: boolean, strHash?: string, paramsToRemove?: string[], wholeNewUrl?: string);
    buildReportingUrl(ajaxUrl: string): string;
    isLoginPage(): boolean;
    resetPopoverStack(): void;

    popoverHandlers: Record<string, (param: string) => void>;
  }

  let broadcast: BroadcastGlobal;

  interface ColorManagerService {
    getColor(namespace: string, name: string): string;
    getColors(namespace: string, names: string[], asArray?: boolean): string[]|{[name: string]: string};
  }

  interface SparklineColors extends Record<string, string> {
    lineColor: string[];
  }

  interface PiwikGlobal {
    installation: boolean; // only set while Matomo is installing
    timezoneOffset: number;
    addCustomPeriod: (name: string, periodClass: any) => void;
    shouldPropagateTokenAuth: boolean;
    token_auth: string;
    idSite: string|number;
    siteName: string;
    period?: string;
    currentDateString?: string;
    startDateString?: string;
    endDateString?: string;
    userCapabilities: string[];
    piwik_url: string;
    helper: PiwikHelperGlobal;
    broadcast: BroadcastGlobal;
    ColorManager: ColorManagerService;
    ajaxRequestFinished?: () => void;
    minDateYear: number;
    minDateMonth: number;
    minDateDay: number;
    maxDateYear: number;
    maxDateMonth: number;
    maxDateDay: number;
    config: Record<string, string|number|string[]>;
    hasSuperUserAccess: boolean;
    language: string;
    cacheBuster: string;

    updatePeriodParamsFromUrl(): void;
    updateDateInTitle(date: string, period: string): void;
    hasUserCapability(capability: string): boolean;
    getBaseDatePickerOptions(defaultDate?: Date|null): {[key: string]: any};
    getSparklineColors(): SparklineColors;
    getBaseDatePickerOptions(defaultDate: Date|null): any;

    on(eventName: string, listener: WrappedEventListener): void;
    off(eventName: string, listener: WrappedEventListener): void;
    postEvent(eventName: string, ...args: any[]): void;
    postEventNoEmit(eventName: string, ...args: any[]): void;
  }

  let piwik: PiwikGlobal;

  interface WidgetsHelper {
    availableWidgets?: unknown[];
    getAvailableWidgets(callback?: (widgets: Record<string, unknown[]>) => unknown);

    firstGetAvailableWidgetsCall?: Promise<void>;
  }

  let widgetsHelper: WidgetsHelper;

  interface AnchorLinkFix {
    scrollToAnchorInUrl(): void;
  }

  interface Window {
    angular: IAngularStatic;
    globalAjaxQueue: GlobalAjaxQueue;
    piwik: PiwikGlobal;
    piwikHelper: PiwikHelperGlobal;
    broadcast: BroadcastGlobal;
    hasBlockedContent: boolean;
    piwik_translations: {[key: string]: string};
    Materialize: M;
    widgetsHelper: WidgetsHelper;
    anchorLinkFix: AnchorLinkFix;
    $: JQueryStatic;
    Piwik_Popover: PiwikPopoverGlobal;

    _pk_translate(translationStringId: string, values: string[]): string;
    require(p: string): any;
    initTopControls(): void;
    vueSanitize(content: string): string;
    showEmptyDashboardNotification(): void;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    translate: (translationStringId: string, ...values: string[]|string[][]) => string;
    $sanitize: Window['vueSanitize'];
  }
}
