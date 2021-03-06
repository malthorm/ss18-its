# SS18-ITS  
  
The current structure is quite limited and will be updated to a proper ITS architecture on the go.  
  
After finishing this project you will know about the different ITS components, how they work in union and  
how they can be used to aid in mobile / virtual learning environments.  
  
## Components  
  
For you to be able to start, there are two simple components:  
  
1. Student service  
   - Establishes a MongoDB connection and retrieves / saves students  
   - Offers a simple rest api for other services (getStudents, getLatestStudents, ...)  
  
    Dependencies: NodeJS > 8.0 (see package.json) and a remote MongoDB  
    Parameters: PORT (default 3001) and MONGO_URL (no default, syntax: mongodb://localhost:27017)  
    Start: `PORT=3000 MONGO_URL=mongodb://localhost:27017 node students/main.js`  
  
2. Gui service  
   - Returns the latest student on request  
  
    Dependencies: NodeJS > 8.0 (see package.json) and the Student service  
    Parameters: PORT (default 3000) and STUDENT_SERVER (no default, syntax: 127.0.0.1:3001)  
    Start: `PORT=3000 STUDENT_SERVER=127.0.0.1:3001 node gui/main.js`
