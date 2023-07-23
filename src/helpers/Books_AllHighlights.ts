import { Book, Meta_con_highlight } from "@/api/Interface";

export default function Books_AllHighlights(books: Book[] | undefined) {
  if (books) {
    const books_highlights: Meta_con_highlight[] = [];

    //Converting the clippings to meta_con_highlight[] form
    books.map((eachBook) => {
      eachBook.highlights.map((eachHiglight) =>
        books_highlights.push({
          title: eachBook.title,
          author: eachBook.author,
          highlight: eachHiglight,
          book_id: eachBook._id,
        })
      );
    });

    return books_highlights;
  }
}
