```mermaid

sequenceDiagram

participant browser
participant server

browser ->> server : GET https://studies.cs.helsinki.fi/exampleapp/spa
activate server
server -->> browser: HTML page
deactivate server

browser ->> server : GET https://studies.cs.helsinki.fi/exampleapp/main.css
activate server
server -->> browser : CSS document
deactivate server

browser ->> server : GET https://studies.cs.helsinki.fi/exampleapp/spa.js
activate server
server -->> browser: javascript file
deactivate server

note right of browser: browser starts executing the js code that fetches the json data from the server

browser ->> server : GET https://studies.cs.helsinki.fi/exampleapp/data.json
activate server
server -->> browser : [{ "content": "HTML is easy", "date": "2023-3-9" }, ... ]
deactivate server

note right of browser: browser starts executing the call back function that renders the notes to the page  

