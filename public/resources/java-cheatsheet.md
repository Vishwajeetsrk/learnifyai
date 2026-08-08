# Java Quick Reference
By Learnify AI — Vishwajeet

## Hello World
```java
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
```

## Variables & Types
```java
int age = 25;
double score = 9.5;
String name = "Vishwajeet";
boolean active = true;
var city = "Bangalore";   // Java 10+
```

## Conditionals & Loops
```java
if (score >= 70) { ... } else { ... }
for (int i = 0; i < 5; i++) { ... }
for (String s : list) { ... }
while (x < 10) { x++; }
```

## Arrays & Lists
```java
int[] nums = {1, 2, 3};
List<String> skills = new ArrayList<>();
skills.add("Java");
skills.forEach(System.out::println);
```

## Methods
```java
static String greet(String name) {
  return "Hello, " + name + "!";
}
```

## Classes & Objects
```java
class Student {
  String name;
  Student(String n) { this.name = n; }
  void study() { System.out.println(name + " is learning"); }
}
new Student("Vish").study();
```

## String Methods
length(), toUpperCase(), substring(), contains(), split(), trim(), equals()

## Useful Imports
java.util.* · java.time.* · java.io.* · java.util.stream.*

## Build with
javac Main.java && java Main — or use VS Code + Extension Pack for Java.
