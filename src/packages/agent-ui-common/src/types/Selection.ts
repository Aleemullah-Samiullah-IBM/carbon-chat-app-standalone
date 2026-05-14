// {
//   "items": {
//        {label: 'Petstore API', content: 'a'},
//        {label: 'Petstore API v3', content: 'b'},
//        {label: 'Puppy Palace API', content: 'c'},
//        {label: 'Petfood Supplies API', content: 'd'},
//   }
// }

interface SelectionOption {
  label: string
  content: string
}

export interface SelectionResponseType {
  items: SelectionOption[]
}

export type NullableSelectionResponseType = SelectionResponseType | null
