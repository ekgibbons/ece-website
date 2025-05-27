import glob
import json
import os

f_in = open("main.html","r")
f_body = open("body.html","w")
f_css = open("body.css","w")

start_body = "<!-- body_tag_start -->"
end_body = "<!-- body_tag_end -->"

start_css = "<!-- css_tag_start -->"
end_css = "<!-- css_tag_end -->"

write_html = False
write_css = False
for line in f_in:
    if line.strip() == start_body:
        write_html = True

    if line.strip() == end_body:
        write_html = False

    if line.strip() == start_css:
        write_css = True

    if line.strip() == end_css:
        write_css = False
        
    if write_html == True:
        f_body.write(line)

    if write_css == True:
        f_css.write(line)

        
f_in.close()
f_body.close()
f_css.close()
