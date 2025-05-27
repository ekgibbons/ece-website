import glob
import json
import os

def insert_logos(partner_file, f_out):
    with open(partner_file,"r") as f_json:
        data = json.load(f_json)


    for i, company_name in enumerate(sorted(data.keys())):
        company = data[company_name]
        
        f_out.write('<li><div class="partners-line">\n')

        if (i%4 - 2) < 0:
            load_dir = "left"
        else:
            load_dir = "right"
            
        f_out.write('<div class="partners fade-in-%s fade-in lazyloaded">\n' % load_dir)
        f_out.write('<p class="aligncenter"><br />')
        f_out.write('<a href="%s" target="_blank"><img alt="%s" '
                    'src="https://apps.weber.edu/wsuimages/ece/logos/%s" /></a></p>\n' %
                    (company["url"], company["alt"], company["img"]))
        f_out.write('</div></div></li>\n')

partner_file = "partners.json"
f_in = open("main_base.html","r")
f_out = open("main.html","w")

for line in f_in:
    if line.strip() == "<!---- partner_entry ----->":
        insert_logos(partner_file, f_out)
    else:
        f_out.write(line)

f_in.close()
f_out.close()


    
# def insert_slide(slide_file, f_out):
#     f = open(slide_file,"r")
#     data = json.load(f)
#     photo = data["photo"]
#     article = data["article"]
#     date = data["date"]
#     text = data["text"]
#     event_type = data["type"]
    
#     f_out.write('<!------------------------------------------------------------- slide -->\n')
#     f_out.write('<div class="post-slide">\n')
#     f_out.write('<div class="hvrbox">\n')
#     f_out.write('<div class="post-img"><img alt="" class="speaker series"')
#     f_out.write('src="%s" /></div>\n' % photo)
#     f_out.write('<div class="hvrbox-layer_top hvrbox-layer_slideleft">\n')
#     f_out.write('<div class="hvrbox-text"><a class="box-link" href="%s" ' % article)
#     f_out.write('style="color:#fff;">More</a><img alt="" class="arrow-white" ') 
#     f_out.write('src="https://www.weber.edu/wsuimages/sales/homepage/arrow-white.svg"/>')
#     f_out.write('</div>\n</div>\n</div>\n')
#     f_out.write('<div class="post-content">\n')
#     f_out.write('<p><span class="font-1-9"><span class="medium">%s </span></span><br />\n' % event_type)
#     f_out.write('<span class="font-1-6 small_gap"><span class="large"><a class="fancy-link" href="%s" ' % article)
#     f_out.write('target="_blank">%s</a></span></span><br />\n' % text)
#     f_out.write('<span class="large"><span class="font-1-9"><span class="medium">')
#     f_out.write('%s</span></span></span></p>\n' % date)
#     f_out.write('</div>\n</div>\n')


# slides = sorted(glob.glob("slides/*.json"),reverse=True)

# f_in = open("main_base.html","r")
# f_out = open("main.html","w")

# for line in f_in:
#     if line.strip() == "<!---- slide_entry ----->":
#         for slide_file in slides:
#             print("inserting: %s" % slide_file)
#             insert_slide(slide_file, f_out)
#     else:
#         f_out.write(line)

# f_in.close()
# f_out.close()
