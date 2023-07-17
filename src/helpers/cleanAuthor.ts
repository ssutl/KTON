function cleanAuthor(author: string) {
  if (author.slice(-1) === ";") {
    return author.slice(0, -1);
  } else {
    return author.replace(";", " & ");
  }
}

export default cleanAuthor;
