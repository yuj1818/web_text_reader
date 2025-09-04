from ebooklib import epub
import io
import re

def txt_to_epub_bytes(txt_bytes: bytes, title: str = "Untitled") -> bytes:
    """
    한글 TXT 바이트를 받아 EPUB 바이트로 변환 (chunk 단위로 나눠서 안정적)
    """
    # 1. 안전한 디코딩
    try:
        text = txt_bytes.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = txt_bytes.decode("cp949")
        except UnicodeDecodeError:
            text = txt_bytes.decode("utf-8", errors="replace")

    # 2. EPUB 책 생성
    book = epub.EpubBook()
    book.set_identifier("id123456")
    book.set_title(title)
    book.set_language("ko")

    # 3. TXT를 chunk로 나누기 (한 챕터당 5000자)
    MAX_CHARS = 5000
    safe_text = text.replace('\r\n', '\n')
    chunks = [safe_text[i:i+MAX_CHARS] for i in range(0, len(safe_text), MAX_CHARS)]

    chapters = []
    for idx, chunk in enumerate(chunks, 1):
        chap = epub.EpubHtml(
            title=f"Chapter {idx}",
            file_name=f"chap_{idx}.xhtml",
            lang="ko"
        )
        chap.content = f"""
        <html>
          <head>
            <meta charset="UTF-8"/>
            <title>{title} - {idx}</title>
          </head>
          <body>
            <h1>{title} - {idx}</h1>
            <p>{chunk.replace('\n','<br/>')}</p>
          </body>
        </html>
        """
        book.add_item(chap)
        chapters.append(chap)

    # 4. Spine과 TOC
    book.spine = ["nav"] + chapters
    book.toc = tuple(epub.Link(ch.file_name, ch.title, ch.file_name) for ch in chapters)

    # 5. Nav/NCX 등록
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    # 6. 기본 CSS 추가
    style = epub.EpubItem(
        uid="style_nav",
        file_name="style/nav.css",
        media_type="text/css",
        content=b"body { font-family: Malgun Gothic, Arial, sans-serif; line-height: 1.5; }"
    )
    book.add_item(style)

    # 7. EPUB 저장 (메모리)
    buf = io.BytesIO()
    epub.write_epub(buf, book)
    epub_bytes = buf.getvalue()

    # 8. 최소 크기 체크
    if len(epub_bytes) < 500:
        raise ValueError("EPUB 생성 실패: 내용이 비어 있습니다.")

    return epub_bytes

def txt_to_epub_bytes_smart(txt_bytes: bytes, book_title: str = "Untitled") -> bytes:
    """
    한글 TXT 바이트를 받아 EPUB 바이트로 변환.
    - 첫 줄에서 '진짜 제목 n화'에서 n화 제거 후 제목 추출
    - '[진짜 제목] n화' 기준으로 챕터 나누기
    - 패턴 없으면 5000자 단위로 fallback
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
    lines = text.split('\n')
    first_line = lines[0].strip() if lines else "Untitled"

    # '1화' 이전 부분이 제목
    match_title = re.match(r'(.+?)\s*\d+화', first_line)
    real_title = match_title.group(1).strip() if match_title else first_line
 
    # 3. EPUB 생성
    book = epub.EpubBook()
    book.set_identifier("id123456")
    book.set_title(book_title)
    book.set_language("ko")

    # 4. '[진짜 제목] n화' 패턴으로 챕터 구분
    # real_title과 붙어있는 n화만 챕터로 잡음
    pattern = re.compile(r'^\s*(.+?)\s*(\d+)화\s*$', re.MULTILINE)
    matches = list(pattern.finditer(text))

    chapters = []

    if matches:
        for idx, match in enumerate(matches):
            start = match.start()
            end = matches[idx+1].start() if idx+1 < len(matches) else len(text)
            chap_title = match.group().strip()
            chap_content = text[start:end].replace('\n','<br/>').strip()

            chap = epub.EpubHtml(
                title=chap_title,
                file_name=f"chap_{idx+1}.xhtml",
                lang="ko"
            )
            chap.content = f"""
            <html>
              <head>
                <meta charset="UTF-8"/>
                <title>{chap_title}</title>
              </head>
              <body>
                <h1>{chap_title}</h1>
                <p>{chap_content}</p>
              </body>
            </html>
            """
            book.add_item(chap)
            chapters.append(chap)
    else:
        # 패턴 없으면 5000자 단위로 fallback
        MAX_CHARS = 5000
        chunks = [text[i:i+MAX_CHARS] for i in range(0, len(text), MAX_CHARS)]
        for idx, chunk in enumerate(chunks, 1):
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
                <p>{chunk.replace('\n','<br/>')}</p>
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