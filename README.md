# Discord Presence Widget

This little React app uses Material UI and the Lanyard API to show a little widget with the avatar, name, and status of a Discord user. The user's ID must be supplied through the URL with a query param (?user_id=\<User ID here\>). By default, if the user is streaming, the widget will be a clickable link to their stream as provided by Discord.

Simple as that, nothing fancy.

## Usage

The widget uses query params (the things at the end of a url) to power its "settings".

Minimum: https://erstongreatman.github.io/discord-presence/?user_id=your_user_id - Replace `your_user_id` with your Discord User ID

#### Here are the query params:

`user_id` - Required. This is the Discord User Id you want the widget for. They must be in the Lanyard Discord for their bot to maintain their info

`url` - Optional: Clicking the widget opens the url in a new window. If the user is streaming, their streaming link has precedence over this URL.

https://erstongreatman.github.io/discord-presence/?user_id=your_user_id&url=your_url - Replace `your_user_id` with your Discord User ID and `your_url` with the url you want to use

Boil it, mash it, stick it in a stew, or an iframe.
