import { Book, Meta_con_highlight } from "@/api/Interface";

export default function Books_AllHighlights(books: Book[] | undefined) {
  if (books) {
    const books_highlights: Meta_con_highlight[] = [];

    //Converting the clippings to meta_con_highlight[] form
    books
      .filter((eachBook) => eachBook.deleted === false)
      .map((eachBook) => {
        eachBook.highlights
          .sort(function (a: any, b: any) {
            return new Date(b.Date).getTime() - new Date(a.Date).getTime();
          })
          .map((eachHiglight) =>
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
