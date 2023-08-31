import { Book, userInfo } from "@/api/Interface";

export const demoUserInfo: userInfo = {
  password: "demoPassword123",
  registration_date: new Date("2023-08-31"),
  username: "DemoUser123",
  profile_picture: "profile-pic-url.jpg",
  book_count: 10,
  dark_mode: true,
  column_count: 3,
  genres: {
    fantasy: "blue",
    mystery: "green",
    romance: "pink",
  },
  categories: ["fiction", "non-fiction"],
  last_upload: "2023-08-30",
  notion_auth: "notion-auth-token-123",
  verified_email: true,
  subscription: true,
  stripe_customer_id: "stripe-customer-id-123",
  has_trial_period: false,
  subscription_end: new Date("2024-08-31"),
};

export const demoBooks: Book[] = [
  {
    annotated: false,
    genre: ["Self-help"],
    _id: "63abd75e139a70021ced2924",
    userID: "63b98299d4a24e32474d3ff7",
    cover_image:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1647263154l/33154385.jpg",
    isbn: "9781847941848",
    author: "James Clear",
    title: "Atomic Habits",
    rating: 5,
    length: 320,
    upload_date: "2021-05-16T21:59:34.000Z",
    summary: `Lesson 1) Small habits make a big difference It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis.
    
Lesson 2) Forget about setting goals. Focus on your system instead. Goals are about the results you want to achieve. Systems are about the processes that lead to those results.If you’re having trouble changing your habits, the problem isn’t you. The problem is your system.
    
Lesson 3) Build identity-based habitsThe key to building lasting habits is focusing on creating a new identity first. Your current behaviors are simply a reflection of your current identity. What you do now is a mirror image of the type of person you believe that you are (either consciously or subconsciously).`,
    deleted: false,
    highlights: [
      {
        category: [],
        _id: "63abd75e139a70021ced2925",
        Text: "A habit is a routine or behavior that is performed regularly—and, in many cases, automatically.",
        Page: 9,
        LocationStart: 124,
        LocationEnd: 124,
        Date: "Sunday, 16 May 2021 22:01:46",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced2926",
        Text: "A habit is a routine or behavior that is performed regularly—and, in many cases, automatically.",
        Page: 9,
        LocationStart: 124,
        LocationEnd: 124,
        Date: "Sunday, 16 May 2021 22:01:46",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: ["Bars"],
        _id: "63abd75e139a70021ced2927",
        Text: "“the aggregation of marginal gains,”",
        Page: 14,
        LocationStart: 200,
        LocationEnd: 200,
        Date: "Monday, 17 May 2021 06:51:46",
        notes: "",
        starred: true,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced2928",
        Text: "if you broke down everything you could think of that goes into riding a bike, and then improve it by 1 percent, you will get a significant increase when you put them all together.”",
        Page: 14,
        LocationStart: 202,
        LocationEnd: 203,
        Date: "Monday, 17 May 2021 06:52:04",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced2929",
        Text: "Too often, we convince ourselves that massive success requires massive action.",
        Page: 15,
        LocationStart: 223,
        LocationEnd: 224,
        Date: "Monday, 17 May 2021 06:55:35",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced292a",
        Text: "if you can get 1 percent better each day for one year, you’ll end up thirty-seven times better by the time you’re done. Conversely, if you get 1 percent worse each day for one year, you’ll decline nearly down to zero. What starts as a small win or a minor setback accumulates into something much more.",
        Page: 15,
        LocationStart: 227,
        LocationEnd: 230,
        Date: "Monday, 17 May 2021 06:57:18",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced292b",
        Text: "Habits are the compound interest of self-improvement.",
        Page: 16,
        LocationStart: 235,
        LocationEnd: 235,
        Date: "Monday, 17 May 2021 06:58:28",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
      {
        category: [],
        _id: "63abd75e139a70021ced292c",
        Text: "The same way that money multiplies through compound interest, the effects of your habits multiply as you repeat them.",
        Page: 16,
        LocationStart: 235,
        LocationEnd: 236,
        Date: "Monday, 17 May 2021 06:58:45",
        notes: "",
        starred: false,
        deleted: false,
        last_updated: "",
      },
    ],
  },
];