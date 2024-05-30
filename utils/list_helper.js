const dummy = (blogs) => {
    return 1 
  }

  const totalLikes = (blogs) => {
    let count = 0 

    for (let i = 0; i < blogs.length; i++) {
      count += blogs[i].likes;
    }
    return count 
  }
  
  const favouriteBlog = (blogs) => {

    if(blogs.length >0){

      let best = blogs[0]

      for (let i = 1; i < blogs.length; i++) {
        if(best.likes < blogs[i].likes){
          best = blogs[i]
        }
      }
      
      delete best._id
      delete best.url
      delete best.__v

      return best

    }else{

      return {}

    }
  }

 
  
  const mostBlogs = (blogs) => {

    if(blogs.length >0){
      const authorCounts = blogs.reduce((counter, blog) => {
        if (counter[blog.author]) {
          counter[blog.author].blogs += 1;
        } else {
          counter[blog.author] = { author: blog.author, blogs: 1 };
        }
        return counter;
      }, {});
      
      const authorsObject = Object.values(authorCounts);
      
      const mostBlogsAuthor = authorsObject.reduce((max, author) => max.blogs > author.blogs ? max : author);
      
      return mostBlogsAuthor

    }else{

      return {}

    }
    
  }

  const mostLikes = (blogs) => {

    if(blogs.length >0){

      const authorCounts = blogs.reduce((counter, blog) => {
        if (counter[blog.author]) {
          counter[blog.author].likes += blog.likes;
        } else {
          counter[blog.author] = { author: blog.author, likes: blog.likes};
        }
        return counter;
      }, {});
      
      const authorsObject = Object.values(authorCounts);
      
      const mostLikesBlogsAuthor = authorsObject.reduce((max, author) => max.likes > author.likes ? max : author);
      
      return mostLikesBlogsAuthor
      
    }else{

      return {}

    }
    
  }

  module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
  }