from pathlib import Path
from PIL import Image, ImageOps
import json, shutil, subprocess

root=Path(__file__).resolve().parent
workspace=root.parent
out=root/'dist/assets';out.mkdir(parents=True,exist_ok=True)
source=workspace/'audit/assets'
records=[]
def export(path,name,width=1500,crop=None):
    with Image.open(path) as img:
        img=ImageOps.exif_transpose(img).convert('RGB')
        if crop: img=img.crop(crop)
        if img.width>width: img=img.resize((width,round(img.height*width/img.width)),Image.Resampling.LANCZOS)
        img.save(out/(name+'.webp'),quality=87,method=6)
        records.append({'name':name,'width':img.width,'height':img.height,'source':str(path.relative_to(workspace))})

for i in [1,2,4,5,7,8,9,10,11,12,13,14,15,16,17,18,20,21,22,23,25,27,28,29,30,31,32,33,34,35,36,37,39,40,41,42,44,45,46,47]:
    export(source/f'{i:03d}.png',f'work-{i:03d}')
for i,tiles in [(48,[1,4,5,6,7,8]),(49,[2,4]),(50,[0,1,5]),(52,[0,2,3])]:
    for tile in tiles: export(source/f'{i:03d}-{tile:02d}.jpg',f'work-{i:03d}-{tile:02d}')
export(source/'048.png','levis-cover',crop=(0,0,1367,584))
export(source/'049.png','plant-cover',crop=(0,0,1366,1060))
export(source/'051.png','prebook-cover',crop=(0,0,1374,850))
export(source/'050.png','plant-home',crop=(0,5030,1366,6170))
export(source/'050.png','plant-swap',crop=(0,6880,1366,8060))
export(source/'050.png','plant-wireframes',crop=(0,0,1366,2620))
export(source/'050.png','plant-style',crop=(0,2620,1366,3520))
export(source/'050.png','plant-listings',crop=(0,8070,1366,8800))
for name,start,end in [('home',8270,9110),('search',9110,9840),('categories',9840,10670),('favorites',10670,11450),('product',11450,12680),('cart',12680,13420)]:
    export(source/'048.png','levis-'+name,crop=(0,start,1367,end))
export(source/'048.png','levis-final',crop=(0,13280,1367,14150))
export(workspace/'inputs/IMG_7938.preview.jpg','karthik',1400)
shutil.copy2(workspace/'inputs/karthik-footer-portrait.png',out/'karthik-footer-portrait.png')
records.append({'name':'karthik-footer-portrait','width':866,'height':790,'source':'inputs/karthik-footer-portrait.png','format':'png'})
for name in ['photomax-demonstration','creativepro-demonstration','photomax-banner']:
    p=out/(name+'.mp4')
    if not p.exists():
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(workspace/'portfolio-assets'/f'{name}.mp4'),'-vf','scale=-2:720','-an','-c:v','libx264','-crf','24','-preset','fast','-movflags','+faststart',str(p)],check=True)
shutil.copy2(workspace/'deliverables/Karthik_Vempati_UI_UX_ATS_Resume.docx',out/'Karthik_Vempati_Resume.docx')
(root/'asset-provenance.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
print(f'{len(records)} optimized images; three videos; résumé copied')
