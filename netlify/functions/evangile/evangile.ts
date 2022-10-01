import { Handler } from '@netlify/functions'
const Parser = require("rss-parser");
let parser = new Parser();


export const handler: Handler = async (event, context) => {
  let feed = await parser.parseURL("https://rss.aelf.org/evangile");
  let evangile = "";
  let title = ""
  if (feed.items.length == 1 || feed.items.length == 2) {
    evangile = feed.items[0].content;
    title = feed.items[0].title;

  } else {
    evangile = feed.items[3].content;
    title = feed.items[3].title;
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      title: title.substring(11),
      evangile
    }),
  }
}