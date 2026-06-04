export type Language = 'en' | 'zh'

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'zh', label: '中文' },
]

export function toLanguage(value: string | null | undefined): Language {
  return value === 'zh' ? 'zh' : 'en'
}
