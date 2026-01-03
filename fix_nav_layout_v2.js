const fs = require("fs");
const path = require("path");

const dirs = [
  path.join(__dirname, "rentals"),
  path.join(__dirname, "services"),
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let originalContent = content;

  // Pattern: Text &raquo; \n <ul ...>
  // We want to verify if </a> is missing between them.
  // If it is missing, we add it.

  // We can use a single regex for all 3 cases since they all end with &raquo; followed by the specific UL class.
  // We look for &raquo; followed by whitespace then <ul class="dropdown-submenu dropdown-menu">
  // AND we negative lookahead to ensure we don't double-add if it's already there (though my previous script didn't add it).

  // Regex: /(&raquo;)(?!\s*<\/a>)(\s*<ul class="dropdown-submenu dropdown-menu">)/g
  // Meaning: Find &raquo;, NOT followed by </a>, followed by the UL.
  // Replace with: &raquo;</a><ul...

  content = content.replace(
    /(&raquo;)(?!\s*<\/a>)(\s*<ul class="dropdown-submenu dropdown-menu">)/g,
    "$1</a>$2"
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Repaired: ${path.basename(filePath)}`);
  } else {
    console.log(
      `No repair needed (or already correct): ${path.basename(filePath)}`
    );
  }
}

dirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
    files.forEach((f) => processFile(path.join(dir, f)));
  }
});
