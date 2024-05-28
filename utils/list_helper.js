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
  
  const bestBlog = (blogs) => {

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

  module.exports = {
    dummy,
    totalLikes,
    bestBlog
  }