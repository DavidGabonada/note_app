import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const Post = ({ post, addComment, user_id }) => {
  const { post_id, first_name, last_name, content, created_at } = post;

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    const fetchLikesAndComments = async () => {
      try {
        
        const likeRes = await axios.post('http://localhost/hugot/get_likes.php', {
          postId: post_id,
          userId: user_id,
        });

        if (likeRes.data.success) {
          setLikeCount(likeRes.data.likeCount);
          setLiked(likeRes.data.liked);
        } else {
          console.error('Failed to fetch likes:', likeRes.data.message);
        }

        
        getComment();
      } catch (error) {
        toast.error("Network Error: " + error.message);
        console.error('Error fetching data:', error);
      }
    };

    fetchLikesAndComments();
  }, [post_id, user_id]);

  const getComment = async () => {
    try {
      const formData = new FormData();
      formData.append("postId", post_id);
      const res = await axios.post("http://localhost/hugot/get_comment.php", formData);
      setAllComments(res.data === 0 ? [] : res.data);
    } catch (error) {
      toast.error("Network Error: " + error.message);
      console.error("Error fetching comments:", error); 
    }
  };

  const handleAddComment = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        try {
          await addComment(post_id, commentText);
          setCommentText('');
          setShowCommentInput(false);
          getComment();
        } catch (error) {
          toast.error("Failed to add comment: " + error.message);
        }
      }
    }
  };

  const handleLikePost = async () => {
    try {
      const response = await axios.post('http://localhost/hugot/like_post.php', {
        postId: post_id,
        userId: user_id,
      });

      console.log('API Response:', response.data);

      if (response.data.success) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      } else {
        const errorMessage = response.data.message || 'Unknown error occurred';
        console.error('Failed to like post:', errorMessage);
        toast.error('Failed to like post: ' + errorMessage);
      }
    } catch (error) {
      toast.error("Network Error: " + error.message);
      console.error('Error liking the post:', error);
    }
  };

  const displayedComments = showMoreComments ? allComments : allComments.slice(0, 3);
  const isScrollable = allComments.length > 3;

  
  const timeAgo = formatDistanceToNow(new Date(created_at), { addSuffix: true });
  const isJustNow = timeAgo === 'less than a minute ago';

  return (
    <div className="mb-8 p-6 rounded-lg shadow-lg bg-white">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-bold text-gray-800">{`${first_name} ${last_name}`}</div>
      </div>
      <div className="text-lg text-gray-800 mb-4">{content}</div>
      
      <div 
        className="text-sm text-gray-600 mb-6 relative cursor-pointer"
        onMouseEnter={() => setShowDate(true)}
        onMouseLeave={() => setShowDate(false)}
      >
        {isJustNow ? 'Just now' : timeAgo}
        {showDate && !isJustNow && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
            {new Date(created_at).toLocaleString()}
          </div>
        )}
      </div>
      
      <div className="flex items-center mb-4 space-x-6">
        <button 
          className={`flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors duration-300 
                      ${liked ? 'text-red-500' : ''}`}
          onClick={handleLikePost}
        >
          <FaHeart className="text-2xl" />
          <span className="font-medium">{likeCount}</span>
        </button>
        <button 
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors duration-300"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <FaComment className="text-2xl" />
          <span className="font-medium">Comment</span>
        </button>
      </div>

      {showCommentInput && (
        <div className="relative mb-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleAddComment}
          />
        </div>
      )}

      <div className={`space-y-4 ${isScrollable ? 'max-h-48 overflow-y-scroll transition-all duration-500' : ''}`}>
        {displayedComments.map((comment, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg border border-gray-200">
            <div className="font-semibold text-blue-600 mb-2">
              {comment.first_name} {comment.last_name}
            </div>
            <div className="text-gray-800">{comment.comment_text}</div>
            <div className="text-gray-500 text-xs mt-1">{new Date(comment.created_at).toLocaleDateString()}</div>
          </div>
        ))}
        {allComments.length > 3 && !showMoreComments && (
          <button
            onClick={() => setShowMoreComments(true)}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            View more comments
          </button>
        )}
        {showMoreComments && (
          <button
            onClick={() => setShowMoreComments(false)}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            Show less
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
