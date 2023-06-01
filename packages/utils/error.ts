const IS_PROD: boolean = ['production'].includes(import.meta.env?.NODE_ENV || 'dev')

export default function huiuiError(text: string, type: 'warn' | 'error' = 'warn'): void {
  if (!IS_PROD) console[type](`[hui-ui-vue3: ${type}]`, text)
}
