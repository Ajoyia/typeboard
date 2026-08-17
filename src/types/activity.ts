export type Activity =
  | {
      kind: 'task'
      id: string
      title: string
      status: 'todo' | 'doing' | 'done'
      at: string
    }
  | {
      kind: 'contact'
      id: string
      name: string
      favorite: boolean
      at: string
    }
  | {
      kind: 'cart'
      id: string
      productName: string
      qty: number
      at: string
    }
