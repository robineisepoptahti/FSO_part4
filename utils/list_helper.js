const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }


const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}
  


const favoriteBlog = (blogs) => {
if (!blogs || blogs.length === 0) {
  return 0
} 
const reducer = (fav, item) => {
    if (fav.likes < item.likes) {
      fav = item 
    }
    return fav
  }
  return blogs.reduce(reducer, blogs[0])
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) {
    return 0;
  }
  const reducer = (most, item) => {
    const blogscpy = _.filter(blogs, (n) => item.author === n.author);
    if (blogscpy.length > most.blogs) {
      return { author: item.author, blogs: blogscpy.length };
    }
    return most;
  }
  return blogs.reduce(reducer, { author: "None", blogs: 0 });
}


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }

