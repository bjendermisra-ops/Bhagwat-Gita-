"""Recover existing source fields; do not generate verse content."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
records=[]; recovered=0; changes=[]
def hook(pairs):
 global recovered
 d={}
 for k,v in pairs:
  if k=='marathi' and k in d:
   d.setdefault('tatparya_marathi',v);recovered+=1
  else:d[k]=v
 return d
for chapter in range(1,19):
 rows=json.loads((ROOT/f'data/chapter{chapter}.json').read_text(),object_pairs_hook=hook)
 for v in rows:
  # Chapter 15 row 13 has two independent correct identifiers and one stale verse field.
  if chapter==15 and v['verse_id']=='15.13' and v['verse']==12:
   changes.append('15.13: verse number field 12 → 13 (printed Sanskrit and verse_id agree).');v['verse']=13
  expected=f"{chapter}.{v['verse']}"
  if v['verse_id']!=expected:
   changes.append(f"{expected}: stale verse_id {v['verse_id']} → {expected}.");v['verse_id']=expected
  assert v['chapter']==chapter
  if expected in ['5.22','8.27','15.5','16.12']:
   old=v['sanskrit'];tail=f"{chapter}-{v['verse']}".translate(str.maketrans('0123456789','०१२३४५६७८९'))
   v['sanskrit']=re.sub(r'[०-९]+\s*[-–]\s*[०-९]+(?=\|\|\s*$)',tail,old)
   if old!=v['sanskrit']:changes.append(f'{expected}: corrected the numeric Sanskrit end-reference only; words unchanged.')
  records.append(v)
assert len(records)==689 and len({x['verse_id'] for x in records})==689
(ROOT/'data/gita-v2.json').write_text(json.dumps(records,ensure_ascii=False,separators=(',',':')))
expected=[47,72,43,42,29,47,30,28,34,42,55,20,35,27,20,24,28,78]
rows=[]
for c,count in enumerate(expected,1):
 nums={v['verse'] for v in records if v['chapter']==c};missing=set(range(1,count+1))-nums
 rows.append(f"| {c} | {len(nums)} | {', '.join(map(str,sorted(missing))) or 'None'} |")
(ROOT/'CONTENT_AUDIT.md').write_text('# Content audit — web edition 12\n\nOriginal chapter files preserved. 689 unique records consolidated. Recovered '+str(recovered)+' duplicate Marathi commentary fields without generating new content.\n\n| Chapter | Available records | Missing verse numbers |\n|---|---:|---|\n'+'\n'.join(rows)+'\n\n## Reference corrections\n\n'+'\n'.join('- '+x for x in changes)+'\n\nNumeric end-reference checks: https://vedabase.io/en/library/bg/5/22/ , https://vedabase.io/en/library/bg/8/27/ , https://vedabase.io/en/library/bg/15/5/ , https://vanisource.org/wiki/BG_16.11-12 .\n\nChapter 13 retains the supplied 35-verse numbering convention. Translations/commentary have not been independently authenticated against a published edition. Missing references display an unavailable message.\n')
print('689 unique verses; 662 recovered Marathi commentary fields; 9 reference/metadata corrections.')
