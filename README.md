# typescript canvas raycaster

You will need `tsc` and `http-server` installed globally:

`npm install typescript -g && npm install http-server -g`

Then:

`npm run build && npm run start`

## changes in this port

Currently trying to get all the magic numbers out of the code and into consts
in preparation for modifying field of view, viewport size, texture size etc.

Also will be changing where we currently use JS objects instead of C structs so 
that they it uses array tuples, which are closer to C structs in terms of 
runtime performance in a hot loop

## Ported from:

### [OpenGL-Raycaster_v3](https://github.com/3DSage/OpenGL-Raycaster_v3)

This is the code from my YouTube video! YouTube-3DSage I still recommend watching the video so you follow along and see what each part does and how it works but here is the code if you need help. Thank you for the support, postive feedback, and comments!
https://www.youtube.com/watch?v=w0Bm4IA-Ii8

