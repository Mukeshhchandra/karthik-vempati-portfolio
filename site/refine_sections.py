import json
from pathlib import Path
root=Path(__file__).resolve().parent
p=root/'projects.json';data=json.loads(p.read_text(encoding='utf-8'))
data[0]['gallery']=[
 ['work-048-01','The original experience: promotional content and category navigation.','wide'],
 ['levis-home','A redesigned home screen balances promotions, categories, and new arrivals.','wide'],
 ['levis-search','Recent searches and suggestions make search easier to start.','wide'],
 ['levis-categories','Expandable categories bring deeper choices into the same view.','wide'],
 ['levis-favorites','Saved items are organized by product category.','wide'],
 ['levis-product','Product information, reviews, and purchase options follow a clearer hierarchy.','wide'],
 ['levis-cart','The cart connects item editing with visible checkout progression.','wide']]
data[1]['gallery']=[
 ['work-049-02','Research questions and a persona exploring affordability, trust, and space.','wide'],
 ['plant-wireframes','Paper sketches and wireframes establish the structure before visual styling.','wide'],
 ['plant-style','A nature-inspired palette and Poppins typography connect the interface components.','wide'],
 ['plant-home','Discovery organizes nearby plants, categories, popular items, and saved offers.','wide'],
 ['plant-swap','The exchange journey connects plant details to a proposed swap.','wide'],
 ['plant-listings','Listing and profile screens support selling, swapping, and managing plants.','wide']]
p.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
p=root/'build.py'
s=p.read_text(encoding='utf-8').replace('preload="none" aria-label="Photomax photography atmosphere film"','preload="none" poster="/assets/work-009.webp" aria-label="Photomax photography atmosphere film"')
p.write_text(s,encoding='utf-8')
