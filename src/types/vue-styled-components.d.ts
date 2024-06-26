declare module 'vue-styled-components' {
  import * as CSS from 'csstype';
  import * as Vue from 'vue';

  export type CSSProperties = CSS.Properties<string | number>;

  export type CSSPseudos = {
    [K in CSS.Pseudos]?: CSSObject;
  };

  export interface ThemeProviderProps<T> {
    theme?: T | ((theme: T) => T);
  }

  export type Interpolation<Props extends VueProps = ExecutionContext> =
    | string
    | Interpolation<Props>[];

  export interface CSSObject extends CSSProperties, CSSPseudos {
    [key: string]: CSSObject | string | number | undefined;
  }

  export type CSS = CSSProperties;

  type VueProps =
    | {
        [propsName: string]: {
          type: new (...args) => unknown;
          default?: unknown;
          required?: boolean;
          validator?(value: unknown): boolean;
        };
      }
    | { [propsName: string]: new (...args) => unknown };

  type PropsType<Props extends VueProps> = {
    [K in keyof Props]: Props[K] extends {
      type: new (...args) => unknown;
    }
      ? InstanceType<Props[K]['type']>
      : Props[K] extends new (...args) => unknown
      ? InstanceType<Props[K]>
      : never;
  };

  type Attrs<P, A extends Partial<P>, T> = {
    [K in keyof A]: ((props: PropsType<P, T>) => A[K]) | A[K];
  };

  export type ThemedStyledProps<P, T> = P & ThemeProviderProps<T>;

  type ThemeProviderComponent<T> = Component<ThemeProviderProps<T>>;

  export type StyledComponent<Props extends VueProps> = Vue.Component &
    Vue.VueConstructor & {
      extend<U extends VueProps>(
        cssRules: TemplateStringsArray,
        ...interpolate: TemplateStringsArray[]
      ): StyledComponent<Props & U>;
      withComponent<V extends VueProps>(
        target: Vue.VueConstructor | string,
      ): StyledComponent<Props & V>;
    } & { new (props: PropsType<Props>): Vue.Component };

  export interface StyledComponentFunction<P, T, O = P> {
    (
      styles: TemplateStringsArray,
      ...interpolations: ((
        props: PropsType<ThemedStyledProps<P & U, T>>,
      ) => str | string | { toString: () => str | string })[]
    ): StyledComponent<P, T, O>;
    <U>(
      styles: TemplateStringsArray,
      ...interpolations: Interpolation<ThemedStyledProps<P & U, T>>[]
    ): StyledComponentFunction<P & U, T, O & U>;
    attrs<U, A extends Partial<P & U> = {}>(
      attrs: Attrs<P & U, A, T>,
    ): StyledComponentFunction<DiffBetween<A, P & U>, T, DiffBetween<A, O & U>>;
  }

  export type StyledComponentElements<T = HTMLElements> = {
    [k in keyof T]: StyledComponentFunction<HTMLElements[k], T>;
  };

  export type Component =
    | HTMLElements
    | keyof HTMLElements
    | Vue.Component
    | Vue.VueConstructor;

  export type Styled = StyledComponentElements & {
    <T extends Component, Props extends VueProps>(
      Component: T,
      props?: Props,
    ): (
      str: TemplateStringsArray,
      ...placeholders: ((
        props: PropsType<Props & ThemeProviderProps>,
      ) => str | string | { toString: () => str | string })[]
    ) => StyledComponent<Props>;
  };

  export function injectGlobal(
    styles: TemplateStringsArray,
    ...interpolations:
      | ((
          props: PropsType<Props & ThemeProviderProps>,
        ) => str | string | { toString: () => str | string })[]
      | string
  ): void;

  export function keyframes(
    styles: TemplateStringsArray,
    ...interpolations: ((
      props: PropsType<Props & ThemeProviderProps>,
    ) => str | string | { toString: () => str | string })[]
  );

  export function css(
    styles: TemplateStringsArray,
    ...interpolations: (
      | ((
          props: PropsType<Props & ThemeProviderProps>,
        ) => str | string | { toString: () => str | string })
      | string
    )[]
  );

  export const ThemeProvider: ThemeProviderComponent<{}>;

  export interface HTMLElements {
    a: HTMLAnchorElement;
    abbr: HTMLElement;
    address: HTMLElement;
    area: HTMLAreaElement;
    article: HTMLElement;
    aside: HTMLElement;
    audio: HTMLAudioElement;
    b: HTMLElement;
    base: HTMLBaseElement;
    bdi: HTMLElement;
    bdo: HTMLElement;
    big: HTMLElement;
    blockquote: HTMLElement;
    body: HTMLBodyElement;
    br: HTMLBRElement;
    button: HTMLButtonElement;
    canvas: HTMLCanvasElement;
    caption: HTMLElement;
    cite: HTMLElement;
    code: HTMLElement;
    col: HTMLTableColElement;
    colgroup: HTMLTableColElement;
    data: HTMLElement;
    datalist: HTMLDataListElement;
    dd: HTMLElement;
    del: HTMLElement;
    details: HTMLElement;
    dfn: HTMLElement;
    dialog: HTMLDialogElement;
    div: HTMLDivElement;
    dl: HTMLDListElement;
    dt: HTMLElement;
    em: HTMLElement;
    embed: HTMLEmbedElement;
    fieldset: HTMLFieldSetElement;
    figcaption: HTMLElement;
    figure: HTMLElement;
    footer: HTMLElement;
    form: HTMLFormElement;
    h1: HTMLHeadingElement;
    h2: HTMLHeadingElement;
    h3: HTMLHeadingElement;
    h4: HTMLHeadingElement;
    h5: HTMLHeadingElement;
    h6: HTMLHeadingElement;
    head: HTMLElement;
    header: HTMLElement;
    hgroup: HTMLElement;
    hr: HTMLHRElement;
    html: HTMLHtmlElement;
    i: HTMLElement;
    iframe: HTMLIFrameElement;
    img: HTMLImageElement;
    input: HTMLInputElement;
    ins: HTMLModElement;
    kbd: HTMLElement;
    keygen: HTMLElement;
    label: HTMLLabelElement;
    legend: HTMLLegendElement;
    li: HTMLLIElement;
    link: HTMLLinkElement;
    main: HTMLElement;
    map: HTMLMapElement;
    mark: HTMLElement;
    menu: HTMLElement;
    menuitem: HTMLElement;
    meta: HTMLMetaElement;
    meter: HTMLElement;
    nav: HTMLElement;
    noscript: HTMLElement;
    object: HTMLObjectElement;
    ol: HTMLOListElement;
    optgroup: HTMLOptGroupElement;
    option: HTMLOptionElement;
    output: HTMLElement;
    p: HTMLParagraphElement;
    param: HTMLParamElement;
    picture: HTMLElement;
    pre: HTMLPreElement;
    progress: HTMLProgressElement;
    q: HTMLQuoteElement;
    rp: HTMLElement;
    rt: HTMLElement;
    ruby: HTMLElement;
    s: HTMLElement;
    samp: HTMLElement;
    script: HTMLScriptElement;
    section: HTMLElement;
    select: HTMLSelectElement;
    small: HTMLElement;
    source: HTMLSourceElement;
    span: HTMLSpanElement;
    strong: HTMLElement;
    style: HTMLStyleElement;
    sub: HTMLElement;
    summary: HTMLElement;
    sup: HTMLElement;
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    td: HTMLTableDataCellElement;
    textarea: HTMLTextAreaElement;
    tfoot: HTMLTableSectionElement;
    th: HTMLTableHeaderCellElement;
    thead: HTMLTableSectionElement;
    time: HTMLElement;
    title: HTMLTitleElement;
    tr: HTMLTableRowElement;
    track: HTMLTrackElement;
    u: HTMLElement;
    ul: HTMLUListElement;
    var: HTMLElement;
    video: HTMLVideoElement;
    wbr: HTMLElement;
  }

  export let styled: Styled;

  export default styled;
}
