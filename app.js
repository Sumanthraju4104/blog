const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect("mongodb://localhost:27017/blog-website", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use(express.static("public"));

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes
app.get("/", (req, res) => {
  
  Blog.find({})
    .exec()
    .then((blogs) => {
      res.render("home", { blogs: blogs });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const blogId = req.params.id;
  
  Blog.findById(blogId)
    .exec()
    .then((blog) => {
      res.render("blog", { blog: blog });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const newBlog = new Blog({
    title: req.body.title,
    content: req.body.content,
  });

  newBlog.save()
    .then((blog) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.error(err);
    });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
