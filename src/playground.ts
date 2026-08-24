import type { Person, Roles } from './types/person'
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


// generic function that takes a value of any type and returns the same type. T means any type.
function anyType<T>(value: T): T {
    return value
}

console.log(anyType('Hello'))
console.log(anyType(123))
console.log(anyType(true))
console.log(anyType({name: 'John', age: 20}))
console.log(anyType([1, 2, 3]))

// T means type parameter. It is a placeholder for a type. any type of array (number, string, boolean, object) can be passed to the function.
// generic function that takes an array of any type and returns an array of the same type. T means any type of array.
function anyTypeArray<T>(values: T[]): T[] {
    return values
}

console.log(anyTypeArray([1, 2, 3]))
console.log(anyTypeArray(['Hello', 'World']))
console.log(anyTypeArray([true, false]))
console.log(anyTypeArray([{name: 'John', age: 20}, {name: 'Jane', age: 21}]))

// Partial<Person> makes all properties optional
type PersonUpdate = Partial<Person>
// Omit<Person, 'role'> removes the role property
type PersonWithoutRole = Omit<Person, 'role'>
// Pick<Person, 'address' | 'city' | 'isActive'> picks only the address, city and isActive properties
type PersonPreview = Pick<Person, 'address' | 'city' | 'isActive'>

let updatePerson: PersonUpdate = { address: '123 Main St', city: 'Anytown' }
let personWithoutRole: PersonWithoutRole = { address: '123 Main St', city: 'Anytown', age: 13, isActive: true }
let personPreview: PersonPreview = { address: '123 Main St', city: 'Anytown', isActive: true }

console.log(updatePerson)
console.log(personWithoutRole)
console.log(personPreview)

// function that takes a role type and prints the role to the console
function printRole(role: Roles): void {
    if (role === "Admin") {
      console.log("admin")
    } else if (role === "User") {
      console.log("user")
    } else {
      console.log("guest")
    }
  }

  printRole(person1.role)
  printRole(person2.role)

  // unknown type - can be any type, but cannot be used without type checking
  let input: unknown = "hello"

  // input.toUpperCase()  // error — uncomment to see it
  if (typeof input === "string") {
    console.log(input.toUpperCase())  // ok here
  }
  
  // readonly property - cannot be changed after initialization
  type Point = {
    readonly x: number
    readonly y: number
  }

  let point: Point = {
    x: 10,
    y: 20
  }

  console.log(point)

  // point.x = 30 // error — cannot assign to a readonly property
  // point.y = 40 // error — cannot assign to a readonly property
  // console.log(point)

  type Pair = [boolean, string] // tuple type - fixed length and type for each element

  let pair: Pair = [true, 'AJ']

  console.log(pair)

  function isString(value: unknown): value is string {
    return typeof value === 'string'
  }

  console.log(isString(pair[1])) // 
  console.log(isString(pair[0]))  // true
  // console.log(isString(pair[2])) // error — tuple type has only 2 elements