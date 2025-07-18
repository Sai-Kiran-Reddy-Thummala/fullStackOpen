const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const reducer = (sum, obj) => {
        return sum + obj.likes
    }

    return blogs.length === 0 
           ? 0
           : blogs.reduce(reducer, 0);
}

const favoriteBlog = (blogs) => {
    const mostLikes = Math.max(...blogs.map(obj => obj.likes))
    const mostLiked = blogs.find(obj => obj.likes === mostLikes)
    return mostLiked;
}

module.exports = { dummy,
                totalLikes,
                favoriteBlog
            }