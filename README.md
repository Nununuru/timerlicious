# timerlicious
Streamelements Subathon / Stream Marathon Timer

## How to add to Streamelements
1. Login to Streamelements
2. In the left sidebar navigate to "My overlays" under "Streaming tools"
3. Create a new overlay or edit an existing one
4. In the editor click the + at the bottom right corner
5. Select "Static / Custom" and "Custom widget"
6. It should create a rectangle in the editor with some stuff in it
7. If not selected, select that new rectangle
8. In the left sidebar select "Settings" if it is collapsed
9. Click on "OPEN EDITOR"
10. You should be presented with a window with multiple tabs
11. Paste the content of the index.html into the HTML tab
12. Paste the content of the index.css into the CSS tab
13. Paste the content of the index.js into the JS tab
14. Paste the content of the index.json into the FIELDS tab
15. At the bottom right click on "Done"
16. After the window closes, click on "SAVE" at the top right
17. Et voila!

## Settings
If you select the newly created widget in your editor view you should see all the possible settings in the left sidebar under "Settings".

### `Timer settings`
Configure the timer behavior.

`Default duration to start with (seconds)`: When using the `start` command the timer will start with this time.
`Enable a max duration`: Enable this if you want the timer not exceeding a specific time.
`Maximum duration (seconds)`: The time the timer should not exceed if the previous setting is enbaled.

### `Timer text styles`
Configure how the timer itself looks like.

`Font family`: Font family of timer (uses Google Fonts).
`Text color`: Color of the timer text.
`Font size`: Font size in pixels.

`Font weight`: Font weight (`Light (300)`, `Normal (400)` or `(Bold) 700)`.

`Text alignment`: Alignment inside the widget box (`left`, `center` or `right`).

`Text shadow right shift`: Text shadow shift on the x achsis in pixels (use negative values to go to the left).

`Text shadow down shift`: Text shadow shift on the y achsis in pixels (use negative values to go up).

`Text shadow blur (px)`: Text shadow blur in pixels.

`Text shadow color`: Color of text shadow

### `Event text`
Configure if you want to display the events that change the timer and its behavior.

### `Event text styles`
Configure how the text of the events look like.

### `Command settings`
Configure if you want specific commands.

### `Twitch event settings`
Configure which Twitch events add time to the timer and how much.
