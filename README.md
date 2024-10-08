
Questions

What were some of the tradeoffs you made when building this and why were these acceptable tradeoffs?
- I used a hard coded file, since for this simple approach that is sufficient, but won't work if we want to use it outside of this assignment.
- I created the processQuery as a function that can be called with the query string. It would be nice to also be able to add the file as a parameter so that we can use it for more than one file.
- I am using console.log to write the results, as that was the assignment, but it would be nice if this also could be changed to something else.
- I am going through the file twice, first to read it and then to parse the query. It would be better to do this in one go, but since the file is small it is acceptable.
- I am using a lot of string manipulation, which is not the most efficient way to do this.
- I wrote some tests, but there are still cases that are not covered. I only wrote tests to make it easier to develop the code, and because of the time restriction it was an acceptable tradeoff.

Given more time, what improvements or optimizations would you want to add? When would you add them?
- One thing that I noticed is that I read the file first and after that I parse the query. This should be reversed, since if we are getting a malformed query request we shouldn't use any resources to read the file. I would add these changes as soon as possible since it would improve the performance in the long run.
- It would be nice to check if there is a better way to do the filtering and the projections, as for example for the projections I have to go through all the rows and there might be a better approach.
- For large data sets we might need to change the implementation to use a database or read the file line by line and write it out line by line, to not have all the data in memory at once.

What changes are needed to accommodate changes to support other data types, multiple filters, or ordering of results? 
- In order to support different data types the castValue function needs to be changed to handle the different data types. The applyFilter also needs to change to handle for example dates.
Multiple filters are already supported, but ordering is not. In order to do ordering the parseQuery function needs another function that can parse the ordering part of the query. After that the processQuery needs to do another call to a new function that does the ordering.

What changes are needed to process extremely large datasets
- To process large datasets we have to change the implementation a bit. First it might not be the best idea to have all the data in memory at once. We could read the file line by line and process it that way. Also, we could use a database to store the data and do the filtering and projections in the database.

What do you still need to do to make this code production ready?
- This code is only writing to the console, so that should be changed for something in production. Also at the moment the code is using a hardcoded filename and a file that is next to the code. That also needs to be changed for something in the production since it won't be usable for much.
We only have a function that has a parameter string that is used to do the query, in order to use this in production we would need an endpoint or something to call this function with the query.