# Python Quick Reference
By Learnify AI — Vishwajeet

## Hello World
```python
print("Hello, World!")
```

## Variables & Types
```python
name = "Vishwajeet"   # str
age = 25              # int
score = 9.5           # float
active = True         # bool
```

## Lists & Dictionaries
```python
skills = ["python", "web", "data"]
skills.append("ai")
for s in skills: print(s)

user = {"name": "Vish", "xp": 1200}
print(user["name"])
```

## Conditionals & Loops
```python
if score >= 70:
    print("Pass")
elif score >= 50:
    print("Retake")
else:
    print("Fail")

for i in range(5): print(i)
while x < 10: x += 1
```

## Functions
```python
def greet(name="Learner"):
    return f"Hello, {name}!"
```

## f-Strings
```python
print(f"User {name} has {xp} XP")
```

## Lists & Dicts Methods
len(), sorted(), sum(), .split(), .join(), .upper(), .lower(), .strip()

## File Handling
```python
with open("notes.txt", "w") as f:
    f.write("Learn daily!")
```

## Imports
```python
import math, random, datetime
from collections import Counter
```

## Errors
try / except / else / finally — always catch specific errors.
