# typescript canvas raycaster

You will need `tsc` and `http-server` installed globally:

`npm install typescript -g && npm install http-server -g`

Then:

`npm run build && npm run start`

## changes in this port

### 1.0.1

Currently trying to get all the magic numbers out of the code and into consts
in preparation for modifying field of view, viewport size, texture size etc.

Also will be changing where we currently use JS objects instead of C structs so 
that they it uses array tuples, which are closer to C structs in terms of 
runtime performance in a hot loop

### 1.0.2

In this caster, with the old settings we drew 120 columns and 640 rows 

This modifies the code to only draw 80 rows - it looks worse but is much faster
and now because we no longer have a discrepency between width and height cells
we can speed up further by blitting pixels in an ImageData directly instead of 
using fillRect

Still some magic numbers to fix so that we can start upscaling

## Ported from:

### [OpenGL-Raycaster_v3](https://github.com/3DSage/OpenGL-Raycaster_v3)

This is the code from my YouTube video! YouTube-3DSage I still recommend watching the video so you follow along and see what each part does and how it works but here is the code if you need help. Thank you for the support, postive feedback, and comments!
https://www.youtube.com/watch?v=w0Bm4IA-Ii8

