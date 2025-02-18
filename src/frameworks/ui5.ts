
import { DirStructure, RewriteKeySource, RewriteKeyContext } from '../core/types'
import { LanguageId } from '../utils'
import { Framework } from './base'

class UI5Framework extends Framework {
  id = 'ui5'
  display = 'SAP UI5'

  detection = {
    packageJSON: [
      '@ui5/cli',
    ],
  }

  languageIds: LanguageId[] = [
    'xml',
    'javascript',
    'typescript',
  ]

  // for visualize the regex, you can use https://regexper.com/
  usageMatchRegex = [
    '\\{(i18n>{key})\\}',
    'getResourceBundle\\(\\)\\.getText\\([\'"`]({key})[\'"`]',
  ]

  refactorTemplates(keypath: string, languageId: string) {
    return [
      `{i18n>${keypath}}`,
      `this.getResourceBundle().getText("${keypath}")`,
      keypath,
    ]
  }

  rewriteKeys(key: string, source: RewriteKeySource, context: RewriteKeyContext = {}) {
    const regexI8n = new RegExp(/i18n>([\w\d\-\.]*)/, 'gm')
    const matches = regexI8n.exec(key)
    if (matches && matches.length > 1)
      key = matches[1]
    return key
  }

  enabledParsers = ['properties']

  pathMatcher(dirStructure?: DirStructure): string {
    return 'i18n_{locale}.properties'
  }

  enableFeatures = {
    LinkedMessages: true,
  }

  perferredLocalePaths = [
    'webapp/i18n',
  ]

  perferredKeystyle = 'flat' as const
}

export default UI5Framework
