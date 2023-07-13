import { Book, Meta_con_highlight } from "@/api/Interface";

export default function clippings_AllHighlights(clippings: string | null) {
  if (clippings) {
    const parsedClippings: Book[] = JSON.parse(clippings);

    const clippings_highlights: Meta_con_highlight[] = [];

    //Converting the clippings to meta_con_highlight[] form
    parsedClippings.map((eachBook) => {
      eachBook.highlights.map((eachHiglight) =>
        clippings_highlights.push({
          title: eachBook.title,
          author: eachBook.author,
          highlight: eachHiglight,
          book_id: eachBook._id,
        })
      );
    });

    return clippings_highlights;
  }
}
