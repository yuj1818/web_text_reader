from ebooklib import epub
import io
import re
import html
import uuid

def txt_to_epub_bytes_flexible(txt_bytes: bytes, default_title: str = "Untitled") -> bytes:
    """
    거의 모든 n화 형식을 지원하는 TXT -> EPUB 변환
    - [제목] n화, n화 [부제], n화. 부제, n화：부제, n화 등
    - 내용이 비어있거나 패턴 없으면 5000자 단위 fallback
    - HTML escape 적용
    """
    # 1. 안전한 디코딩
    try:
        text = txt_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = txt_bytes.decode("cp949")
        except UnicodeDecodeError:
            text = txt_bytes.decode("utf-8", errors="replace")

    text = text.replace('\r\n', '\n').strip()

    # 2. 첫 줄에서 실제 제목 추출
    first_line = text.split('\n')[0].strip() if text else default_title
    match_title = re.match(r'(.+?)\s*\d+화', first_line)
    real_title = match_title.group(1).strip() if match_title else first_line

    # 3. EPUB 생성
    book = epub.EpubBook()
    book.set_identifier(uuid.uuid4())
    book.set_title(default_title)
    book.set_language("ko")

    # 4. 챕터 패턴: 다양한 n화 형식 허용
    pattern = re.compile(
        r'^\s*'                               # 줄 시작 공백 허용
        r'(?:\[(?P<title1>.*?)\]\s*)?'        # [제목] optional
        r'(?P<num>\d+)화'                     # n화
        r'(?:[.：:)]\s*(?P<subtitle>.+?))?'   # .,：,:), 구분자 후 부제 optional
        r'\s*$', re.MULTILINE
    )

    matches = list(pattern.finditer(text))
    chapters = []

    if matches:
        for idx, match in enumerate(matches):
            start = match.start()
            end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)

            chap_title_parts = [
                match.group('title1') or '',
                match.group('num') + "화",
                match.group('subtitle') or ''
            ]
            full_title = " ".join(filter(None, [part.strip() for part in chap_title_parts]))

            chap_content = text[start:end].strip()
            if not chap_content:
                chap_content = "내용 없음"
            chap_content = html.escape(chap_content).replace('\n','<br/>')

            chap = epub.EpubHtml(
                title=full_title,
                file_name=f"chap_{idx+1}.xhtml",
                lang="ko"
            )
            chap.content = f"""
            <html>
              <head>
                <meta charset="UTF-8"/>
                <title>{full_title}</title>
              </head>
              <body>
                <h1>{full_title}</h1>
                <p>{chap_content}</p>
              </body>
            </html>
            """
            book.add_item(chap)
            chapters.append(chap)
    else:
        # 패턴 없으면 5000자 단위 fallback
        MAX_CHARS = 5000
        chunks = [text[i:i+MAX_CHARS] for i in range(0, len(text), MAX_CHARS)]
        for idx, chunk in enumerate(chunks, 1):
            chap_content = html.escape(chunk).replace('\n','<br/>')
            chap = epub.EpubHtml(
                title=f"{real_title} - Chapter {idx}",
                file_name=f"chap_{idx}.xhtml",
                lang="ko"
            )
            chap.content = f"""
            <html>
              <head>
                <meta charset="UTF-8"/>
                <title>{real_title} - Chapter {idx}</title>
              </head>
              <body>
                <h1>{real_title} - Chapter {idx}</h1>
                <p>{chap_content}</p>
              </body>
            </html>
            """
            book.add_item(chap)
            chapters.append(chap)

    # 5. Spine과 TOC
    book.spine = ["nav"] + chapters
    book.toc = tuple(epub.Link(ch.file_name, ch.title, ch.file_name) for ch in chapters)

    # 6. Nav/NCX 등록
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    # 7. CSS 추가
    style = epub.EpubItem(
        uid="style_nav",
        file_name="style/nav.css",
        media_type="text/css",
        content=b"body { font-family: Malgun Gothic, Arial, sans-serif; line-height: 1.5; }"
    )
    book.add_item(style)

    # 8. EPUB 저장 (메모리)
    buf = io.BytesIO()
    epub.write_epub(buf, book)
    epub_bytes = buf.getvalue()

    if len(epub_bytes) < 500:
        raise ValueError("EPUB 생성 실패: 내용이 비어 있습니다.")

    return epub_bytes
