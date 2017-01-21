function show(msg = 'default msg') {
    console.log(msg);
}
show('hello');
show();

function Person1(name, age) {
    this.name = name || 'default name';
    this.age = age || -1;
}
Person1.prototype = {
    show: function() {
        console.log('My name is %s,I am %d years old', this.name, this.age);
    },
};
class Person {
    constructor(name = 'default name', age = '-1') {
        this.name = name;
        this.age = age;
    }
    show() {
        console.log('My name is %s,I am %d years old', this.name, this.age);
    }
}
class Student extends Person {
    constructor(name, age, grade = -1) {
        super(name, age);
        this.grade = grade;
    }
    show() {
        super.show();
        console.log('My name is %s,I am %d years old,I am in grade %d.', this.name, this.age, this.grade);
    }
}
var tom = new Person('tom', 26);
var nobody = new Person();
var nobody2 = new Person1();
// tom.show();
// nobody.show();
// nobody2.show();
var wang = new Student('wang', 99, 1);
wang.show();
var li = new Student();
li.show();
