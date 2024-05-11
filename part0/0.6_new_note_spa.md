```mermaid

sequenceDiagram

    participant browser
    participant server

    note over browser: browser executes the event-handler<br/>which it fetched from the server,<br> then creates a notes list and<br>adds the new note to that list.<br> After that it sends the note to the server.
    
    browser ->> server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server -->> browser: 201 created
    deactivate server

    note right of browser: new note is created on server and json response is returned