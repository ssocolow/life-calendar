
export type ModalContentType = 
  | { type: 'WEEK'; date: Date }
  | { type: 'DAY'; date: Date }
  | { type: 'HOUR'; date: Date }
  | { type: 'MINUTE'; date: Date }
  | null;