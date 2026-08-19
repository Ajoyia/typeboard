// declare a variable with `let` (can be reassigned later) and explicitly type it as string
let title: string = 'Hello World'

// declare a number variable without an initial value — TypeScript still knows it must be a number
let count: number

// declare a boolean variable with an initial value of true
let ready: boolean = true

// reassign `title` to a new string — allowed because we used `let`
title = 'New Person'

// assign a value to `count` now that it was declared earlier
count = 20000

// another string variable with a type annotation
let message: string = 'hello world'

// an array where every item must be a string — `string[]` is the type
let prices: string[] = ['hello', 'world']

// a union type of literal strings — `role` can ONLY be one of these three exact values
type Roles = 'Admin' | 'User' | 'Guest'

// an object type (shape/interface) — describes what properties a Person must have and their types
interface Person {
    address: string,
    city: string,
    age: number,
    isActive: boolean,
    role: Roles
}

// `const` means the variable binding cannot be reassigned — the object itself is typed as Person
const person1: Person = {
    address: '123 Main St',
    city: 'Anytown',
    age: 13,
    isActive: true,
    role: 'Admin'
}

// `let` allows reassignment — same Person type, different values
let person2: Person = {
    address: '123 Bolevarda',
    city: 'hamilton',
    age: 13,
    isActive: true,
    role: 'User'
}

// another literal union type — only these three exact strings are valid for Name
type Name = 'AJ' | 'John' | 'Doe'

// a separate literal union type with different allowed values
type NewName = 'Johnny' | 'Downey'

// union of two types — `name` can be any value from Name OR NewName
let name: Name | NewName = 'Downey'

// `const` string — value is fixed and cannot be reassigned
const address: string = '123 Main St'

// print the address to the console
console.log(address)

// print the name to the console
console.log(name)


// function that takes a string parameter and returns a string — return type is explicit
function getName(name: string): string{
    return name
}

// function that takes a Person object and returns the same Person object
function getPerson(person: Person): Person{
    return person
}

// function with `void` return type — it performs an action but returns nothing
function voidFunction(person: Person): void{
    console.log(person)
}

// call getPerson with person2 and log the returned object
console.log(getPerson(person2))

// call getName with a string argument and log the result
console.log(getName('Micheal'))

// call voidFunction — runs the side effect (console.log) with no return value to capture
voidFunction(person2)

// object type with an optional property — `flag` can be included or omitted
type Country = {
    name: string,
    isoCode: string,
    flag?: string
}

// object type with an optional property — `flag` can be included or omitted
let pakistan: Country = {
    name: 'Pakistan',
    isoCode: 'PK'
}

console.log(pakistan)

// nullable type - `string` or `null` values can be either string or null
let nickname: string | null = null;

nickname = 'John'

// array of Person objects
let people: Person[] = [person1, person2]

console.log(people)


// function that takes a role type and returns a string
function getRoleName(role: Roles): string {
    return role
}

console.log(getRoleName('Admin'))