Since I didn't have that much time to do this assignment, there are tradeoffs with it.
- There is no way to do ordering. For that to work, I would need to change up the string split a bit, and do an ordering on the array.
- In case of different data types like booleans or dates, I would need to add some more logic to handle those cases.
- Only projections are supported, select is not.
- For large datasets, this implementation wouldn't be sufficient. Since all the information is stored in memory, in case of large datasets we would need to use a database to store the data.
- We have the csv file hardcoded in the function, that should be changed to a parameter.

