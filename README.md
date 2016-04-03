# CsSocket

This is the repository for CsSocket development. CsSocket (AKA Jie, for now) is my original research that allows for people to jam over the internet.

# Bug reports, fixes and feature requests:

For this, please use the GitHub Issue Tracking system and report any bugs that you find. If you have a bug fix that you would like to add, please put in a pull request!

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

## Some of the `bridge.js` code:

bridge.js is what you use to, well, bridge messages between two people. The architecture is very simple:

Assume that you and your friend are connected to the same server and you want to say hi... You send the server a message saying "hi" and the server sends back the message to you and sends it to your friend also. This way, everyone has the same data.

Callbacks that are used:


- `event:` This is used to parse, well, events. This will be expounded in detail in the next section

- `MIDImessage:` Your standard, everyday midi message. More info in the client documentation.

- `request_orc:` respond to orchestra requests.

- `orc:` set orchestras (useful if you're doing live-coding)

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

- `note_message:` A note message in the csound score syntax style. Example: `i 1 0 4 60`

- `channel_message:` Handle real-time movement for knobs.

- `sequence:` Handle a sequence of notes.

MIDI messages are handled independently.

The noteworthy events handled on the server are the `add_client` and the `control_disable` events.

Event args typically contain the arguments that are pertinent to the related event. Future updates will most certainly make sure that these arguments are parsed as opposed to being sent out-right.

## How things happen on the client:

Socket event (as in messages that come through the socket) handling  happens on `socket_interface.js`. We won't dissect the entire thing, but, hey, let's do as much as we can.


- The `connect` function handles what happens after you connect. It asks for a client list.

- `instrument_ctrl` has been deprecated.

- `event` is basically, sent to the `parse_event` function.

- `current_ind` is your current position in the client array.

-  `you` is information about you, which you store in the "me" variable. Cute.

- `MIDImessage` is a standard MIDI message broken up into 1 status byte and 2 data bytes.

- `disconnect` prints "oh noes!"

- `client_add` adds a client to the performers window.

- `client_list` basically handles client lists... How cool!


# Experimental programs that are still in the js folder:

Feel free to look at these programs and add to them as you wish:

- autoplay.js
- CsoundStringHandler.js
- parser.js
- KeyboardMIDIPlayer.js



# Credits:

These are people who have contributed to this project in more than one way (significantly is a better way of phrasing it):

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
