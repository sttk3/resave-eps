import { JSXInternal } from 'preact/src/jsx';

declare module 'preact/src/jsx' {
  namespace JSXInternal {
    interface IntrinsicElements {
      'sp-theme': unknown, 
      'sp-illustrated-message': unknown
    }
  }
}