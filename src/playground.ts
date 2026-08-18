let title: string = 'Hello World'

let count: number

let ready: boolean = true

title = 'New Person'

count = 20000

let message: string = 'hello world'

let prices: string[] = ['hello', 'world']

type Roles = 'Admin' | 'User' | 'Guest'

type Person = {
    address: string,
    city: string,
    age: number,
    isActive: boolean,
    role: Roles
}

const person1: Person = {
    address: '123 Main St',
    city: 'Anytown',
    age: 13,
    isActive: true,
    role: 'Admin'
}

let person2: Person = {
    address: '123 Bolevarda',
    city: 'hamilton',
    age: 13,
    isActive: true,
    role: 'User'
}

type Name = 'AJ' | 'John' | 'Doe'

type NewName = 'Johnny' | 'Downey'

let name: Name | NewName = 'Downey'

const address: string = '123 Main St'

console.log(address)

console.log(name)


function getName(name: string): string{
    return name
}

function getPerson(person: Person): Person{
    return person
}

function voidFunction(person: Person): void{
    console.log(person)
}

console.log(getPerson(person2))

console.log(getName('Micheal'))

voidFunction(person2)