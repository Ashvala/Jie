# CsSocket

This is the repository for CsSocket development. CsSocket (AKA Jie, for now) is my original research that allows for people to jam over the internet.

# A bit of documentation:

## Prerequisites:

- Node.js
- Apache
- Google Chrome

Installation instructions for these are widely available.

## Installation:

- Go to the `js/` directory on your terminal
- Install the following packages using npm:

```
    $ npm install socket.io
    $ npm install express
```


- To start the node.js server to pass messages around run:

    ```
    $ node bridge.js
    ```    
- Now, navigate to the directory you unarchiv ed this in with Google Chrome and enjoy.

## Some of the bridge.js code:

bridge.js is what you use to, well, bridge messages between two people. The architecture is very simple:

Assume that you and your friend are connected to the same server and you want to say hi... You send the server a message saying "hi" and the server sends back the message to you and sends it to your friend also. This way, everyone has the same data.

Callbacks that are used:


- `event:` This is used to parse, well, events. This will be expounded in detail in the next section

- `MIDImessage:` Your standard, everyday midi message. More info in the client documentation.

- `request_orc:` respond to orchestra requests.

- `orc:` set orchestras (useful if you're doing live-coding)

- `control_disable:` Soon to be deprecated, but, just handles disable of buttons on clients.

- `client_list_req:` respond to requests about who are connected.

- `ping:` pong.


Now, let's tackle the big elephant in the room:

#### Event message parsing:

Your typical event message looks like this:

```
{
    from: ...,
    event_type: ...,
    event_args: ...
}
```

Typically, your from message contains information such as who the client is and what their ID, Role, Socket.io ID is and so on. This is useful in making sure that the person sending the data is, well, the person sending the data.

event_type is restricted to the following for the moment:

- `add_client:` Server side only event that allows you to add clients to the client array.

- `note_message:` A note message in the csound score syntax style. Example: i 1 0 4 60

- `channel_message:` Handle real-time movement for knobs.

- `sequence:` Handle a sequence of notes.

MIDI messages are handled independently.

The only noteworthy(*giggles* <sup>Plz<sup>don't<sup>hurt<sup>me</sup></sup></sup></sup>) event handled on the server is the `add_client` event.

# Credits:

These are people who have contributed to this project in more than one way:

- Ashvala Vinay
- Dr. Richard Boulanger
- Lydia Renold

Shout-out to the students from Dr. Boulanger's EP-491 section for Spring 2016 for helping me test things and continually suggesting things for me to fix and add. They are:

- Peder Barett-Due
- Stian Hansen
- Cordelia Vizcaino Leal
- Andrew Perrin
- Darius Petermann
- Courtney Reed
