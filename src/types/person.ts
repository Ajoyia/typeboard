// a union type of literal strings — `role` can ONLY be one of these three exact values
export type Roles = 'Admin' | 'User' | 'Guest';

// an object type (shape/interface) — describes what properties a Person must have and their types
export interface Person {
    address: string,
    city: string,
    age: number,
    isActive: boolean,
    role: Roles
}