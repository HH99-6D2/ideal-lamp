ideal-lamp
==========

Nodejs based Chatting socket reboot

User
----

:``/users``\: GET

   - 200: User list data

:``/users/:id``\: GET

   - 200: User Object data 
   - 404: User not Found 

ERRORS
^^^^^^

404 Not Found
   The server has not found anything matching the Request-URI. No indication is given of whether the condition is temporary or permanent. The 410 (Gone) status code SHOULD be used if the server knows, through some internally configurable mechanism, that an old resource is permanently unavailable and has no forwarding address. This status code is commonly used when the server does not wish to reveal exactly why the request has been refused, or when no other response is applicable.

   Use Cases

      - ``users/:id``
         "When User Id not exist"

