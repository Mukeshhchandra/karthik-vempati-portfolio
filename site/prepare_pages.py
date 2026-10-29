"""Package the static portfolio for a root or GitHub Pages project URL.

The reviewed local dist/ stays unchanged. Publish only this script's output.
"""

import argparse
import html
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import shutil
from urllib.parse import unquote, urlsplit


SOURCE = Path(__file__).resolve().parent / "dist"
URL_ATTRIBUTE = re.compile(r'''(\b(?:href|src|poster|data-full)\s*=\s*)(["'])(/(?!/).*?)\2''')
PROJECT_ATTRIBUTE = re.compile(r'''(\bdata-projects\s*=\s*)(["'])(.*?)\2''')
CSS_URL = re.compile(r'''url\(\s*(["']?)(/(?!/)[^\s)'";]*)\1\s*\)''')


def normalize_base(value):
    value = value.strip().strip("/")
    if value and not re.fullmatch(r"[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*", value):
        raise ValueError("Base path must contain only URL path segments")
    if any(part in {".", ".."} for part in value.split("/")):
        raise ValueError("Base path cannot contain relative segments")
    return "/" + value if value else ""


def public_html(text, base, not_found=False):
    text = URL_ATTRIBUTE.sub(lambda m: m[1] + m[2] + base + m[3] + m[2], text)

    def project_data(match):
        projects = json.loads(html.unescape(match[3]))
        for project in projects:
            for key in ("src", "href"):
                if project.get(key, "").startswith("/") and not project[key].startswith("//"):
                    project[key] = base + project[key]
        encoded = html.escape(json.dumps(projects, ensure_ascii=False), quote=True)
        return match[1] + match[2] + encoded + match[2]

    text = PROJECT_ATTRIBUTE.sub(project_data, text)
    if not not_found:
        text = text.replace('name="robots" content="noindex,nofollow"',
                            'name="robots" content="index,follow"')
    return text


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []
        self.ids = set()

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        self.urls.extend(attrs[name] for name in ("href", "src", "poster", "data-full") if attrs.get(name))
        if "data-projects" in attrs:
            for project in json.loads(attrs["data-projects"]):
                self.urls.extend(project[key] for key in ("src", "href"))


def validate(output, base):
    pages = {}
    for path in output.rglob("*.html"):
        parser = References()
        parser.feed(path.read_text(encoding="utf-8"))
        pages[path.resolve()] = parser
    checked = 0
    for path, page in pages.items():
        for url in page.urls:
            parsed = urlsplit(url)
            if parsed.scheme or parsed.netloc:
                continue
            relative = unquote(parsed.path)
            if relative.startswith("/"):
                if not relative.startswith(base + "/"):
                    raise ValueError(f"URL escaped the site base path: {path}: {url}")
                target = output / relative[len(base):].lstrip("/")
            else:
                target = path.parent / relative if relative else path
            if target.is_dir():
                target /= "index.html"
            if not target.is_file():
                raise ValueError(f"Missing published file: {path}: {url}")
            destination = pages.get(target.resolve())
            if parsed.fragment and destination and unquote(parsed.fragment) not in destination.ids:
                raise ValueError(f"Missing published fragment: {path}: {url}")
            checked += 1
    return {"pages": len(pages), "local_references_checked": checked, "base_path": base or "/"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-path", default="/karthik-vempati-portfolio")
    parser.add_argument("--output", type=Path, default=Path("_site"))
    args = parser.parse_args()
    base = normalize_base(args.base_path)
    output = args.output.resolve()
    if output == SOURCE.resolve() or SOURCE.resolve() in output.parents:
        raise ValueError("Choose an output directory outside site/dist")
    output.mkdir(parents=True, exist_ok=False)
    for source in SOURCE.rglob("*"):
        if not source.is_file() or source.name.startswith("_qa"):
            continue
        target = output / source.relative_to(SOURCE)
        target.parent.mkdir(parents=True, exist_ok=True)
        if source.suffix == ".html":
            target.write_text(public_html(source.read_text(encoding="utf-8"), base,
                                          source.name == "404.html"), encoding="utf-8")
        elif source.suffix == ".css":
            text = CSS_URL.sub(lambda m: "url(" + m[1] + base + m[2] + m[1] + ")",
                               source.read_text(encoding="utf-8"))
            target.write_text(text, encoding="utf-8")
        else:
            shutil.copy2(source, target)
    (output / ".nojekyll").touch()
    print(json.dumps(validate(output, base), indent=2))


if __name__ == "__main__":
    main()
