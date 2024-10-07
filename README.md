Since I didn't have that much time to do this assignment, there are tradeoffs with it.
- There is no way to do ordering. For that to work, I would need to change up the string split a bit, and do an ordering on the array.
- In case of different data types like booleans or dates, I would need to add some more logic to handle those cases.
- Only projections are supported, select is not.
- For large datasets, this implementation wouldn't be sufficient. Since all the information is stored in memory, in case of large datasets we would need to use a database to store the data.
- We have the csv file hardcoded in the function, that should be changed to a parameter.

Would be nice to have types for everything.
Since it only writes to the console, it would be nice to have a way to write to somewhere else as well.
Might need some more error handling.
If there are bigger datasets, the functions should be optimized to handle them. Filters are done first, so that should help a bit.
