from ebooklib import epub
import io

def txt_to_epub_bytes(txt_bytes: bytes, title: str = "Untitled") -> bytes:
    """
    txt 내용을 받아 epub 바이트를 반환
    """
    text = txt_bytes.decode("utf-8", errors="ignore")

    book = epub.EpubBook()
    book.set_identifier("id123456")
    book.set_title(title)
    book.set_language("en")

    # 기본 챕터 생성
    chapter = epub.EpubHtml(title="Chapter 1", file_name="chap_1.xhtml", lang="en")
    chapter.content = f"<h1>{title}</h1><p>{text.replace('\n', '<br/>')}</p>"

    book.add_item(chapter)
    book.spine = ["nav", chapter]
    book.add_item(epub.EpubNcx())
    book.add_item(epub.EpubNav())

    # EPUB 저장 → 메모리로
    buf = io.BytesIO()
    epub.write_epub(buf, book, {})
    return buf.getvalue()
