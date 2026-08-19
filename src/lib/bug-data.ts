export const bug = {
  type: "SQL Injection",
  severity: "Critical",
  file: "src/api/auth.js",
  line: 31,
  confidence: 98,
  category: "Security",
  cwe: "CWE-89",
};

export const scanSteps = [
  { label: "Parsing AST", detail: "412 files · 38,204 nodes" },
  { label: "Resolving dependencies", detail: "184 packages" },
  { label: "Taint tracking", detail: "req.params → db.query" },
  { label: "Secret patterns", detail: "no leaked keys" },
  { label: "Logic & races", detail: "2 low-risk notes" },
  { label: "AI review", detail: "1 critical finding" },
] as const;

export const rootCause = [
  {
    key: "doing",
    title: "What the code is doing",
    body: "getUser() takes an id straight from the HTTP request and builds a SQL string by concatenation, then hands the whole string to the database driver.",
  },
  {
    key: "wrong",
    title: "What went wrong",
    body: "The id is never validated, escaped or parameterised. The database cannot tell the difference between your query and the attacker's payload — it is all one string.",
  },
  {
    key: "danger",
    title: "Why it is dangerous",
    body: "A request like /user/1 OR 1=1-- dumps every user row. UNION SELECT can read password hashes; stacked statements can DROP the table entirely.",
  },
  {
    key: "prevent",
    title: "How to prevent it",
    body: "Always use parameterised queries or a query builder, validate the shape of every input at the edge, and give the app database user the smallest privileges it needs.",
  },
] as const;

export const dnaNodes = [
  {
    key: "security",
    label: "Security",
    score: 94,
    angle: -90,
    body: "Unsanitised input reaches the SQL engine. Full read/write access to the users table is reachable from an unauthenticated route.",
  },
  {
    key: "performance",
    label: "Performance",
    score: 38,
    angle: -18,
    body: "String-built queries defeat prepared-statement caching, so the planner re-parses on every request.",
  },
  {
    key: "maintainability",
    label: "Maintainability",
    score: 61,
    angle: 90,
    body: "The same concatenation pattern is copied across 6 handlers, so any fix has to be repeated by hand.",
  },
  {
    key: "logic",
    label: "Logic",
    score: 47,
    angle: 198,
    body: "No guard for a missing or non-numeric id — the function silently returns whatever the malformed query produces.",
  },
] as const;

export const commits = [
  {
    id: "COMMIT 01",
    hash: "a91f3c2",
    author: "maya",
    msg: "add user lookup endpoint",
    infected: false,
    lines: [
      { n: 30, code: "function getUser(id) {" },
      { n: 31, code: "  return db.users.findById(id);" },
      { n: 32, code: "}" },
    ],
  },
  {
    id: "COMMIT 02",
    hash: "5be0d17",
    author: "maya",
    msg: "add pagination helpers",
    infected: false,
    lines: [
      { n: 30, code: "function getUser(id) {" },
      { n: 31, code: "  return db.users.findById(id);" },
      { n: 32, code: "}" },
    ],
  },
  {
    id: "COMMIT 03",
    hash: "c74a8e9",
    author: "dev-bot",
    msg: "switch to raw sql for speed",
    infected: true,
    lines: [
      { n: 30, code: "function getUser(id) {" },
      { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;', state: "bad" as const },
      { n: 32, code: "  return db.query(query);" },
      { n: 33, code: "}" },
    ],
  },
  {
    id: "COMMIT 04",
    hash: "1f60b45",
    author: "sam",
    msg: "add caching layer",
    infected: false,
    lines: [
      { n: 30, code: "function getUser(id) {" },
      { n: 31, code: '  const query = "SELECT * FROM users WHERE id = " + id;', state: "bad" as const },
      { n: 32, code: "  return cache.wrap(id, () => db.query(query));" },
      { n: 33, code: "}" },
    ],
  },
];

export const riskAreas = [
  { key: "security", label: "Security", score: 92, note: "1 critical injection · 2 weak headers" },
  { key: "performance", label: "Performance", score: 41, note: "N+1 query in /feed" },
  { key: "reliability", label: "Reliability", score: 57, note: "unhandled rejection in worker" },
  { key: "maintainability", label: "Maintainability", score: 63, note: "duplicated db access layer" },
] as const;

export const askAnswers = [
  {
    q: "Why is this bug dangerous?",
    a: "Because the database executes attacker text as code. `/user/1 OR 1=1--` returns every user; a UNION SELECT can pull password hashes out of the same endpoint. No login required.",
  },
  {
    q: "Where did it come from?",
    a: "Commit c74a8e9 — \"switch to raw sql for speed\". The ORM call was replaced by string concatenation and the change shipped without a review on the data layer.",
  },
  {
    q: "What's the safest fix?",
    a: "Parameterise: `db.query(\"SELECT * FROM users WHERE id = ?\", [id])`. The driver sends the value separately, so it can never be parsed as SQL. Add a numeric guard on id at the route edge.",
  },
  {
    q: "Could this cause a security issue?",
    a: "It already is one. Severity Critical, CWE-89, confidence 98%. It is reachable from a public route and touches a table holding credentials — treat it as an incident, not a backlog item.",
  },
] as const;
