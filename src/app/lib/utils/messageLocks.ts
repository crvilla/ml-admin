const processingContacts = new Set<string>()

export function isProcessing(contactId: string): boolean {
  return processingContacts.has(contactId)
}

export function markProcessing(contactId: string): void {
  processingContacts.add(contactId)
}

export function unmarkProcessing(contactId: string): void {
  processingContacts.delete(contactId)
}
