"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaArrowRight } from 'react-icons/fa';
import { formatDistanceToNow, format } from 'date-fns';

const Post = ({ post, addComment, likePost, user_id }) => {
  const {
    post_id,
    post_first_name,
    post_last_name,
    post_content,
    comments = [],
    likes = 0,
    post_created_at,
  } = post;

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost/hugot/api.php?action=getLikeStatus&post_id=${post_id}&user_id=${user_id}`
        );
        const data = await response.json();
        if (data.success) {
          setLiked(data.liked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    checkLikeStatus();
  }, [post_id, user_id]);

  const handleLike = async () => {
    try {
      const response = await likePost(post_id);
      if (response.success) {
        setLiked(!liked);
        setLikeCount(likeCount + (liked ? -1 : 1));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(post_id, commentText);
      setCommentText('');
      setShowCommentInput(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddComment();
    }
  };

  const formattedDate = formatDistanceToNow(new Date(post_created_at), { addSuffix: true });
  const fullDate = format(new Date(post_created_at), "EEEE, MMMM d, yyyy 'at' h:mm a");

  return (
    <div className="p-4 bg-white shadow rounded-lg border border-gray-300">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-700">
          <span className="font-bold">{post_first_name} {post_last_name}</span>
          <span
            className="ml-2 relative"
            title={fullDate} // Tooltip will show full date and time
          >
            {formattedDate}
          </span>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{post_content}</p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-500'}`}
          >
            <FaHeart /> <span>{likeCount}</span>
          </button>
          <button
            onClick={() => setShowCommentInput(!showCommentInput)}
            className="flex items-center space-x-2 text-gray-500"
          >
            <FaComment /> <span>{comments.length}</span>
          </button>
        </div>
      </div>

      {showCommentInput && (
        <div className="mt-4 relative">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
            placeholder="Write a comment..."
          />
          <button
            onClick={handleAddComment}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-500 hover:text-amber-600"
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-4">
          {showMoreComments ? (
            <div className="max-h-40 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.comment_id} className="mt-2 text-sm text-gray-700">
                  <span className="font-bold">{comment.comment_first_name} {comment.comment_last_name}</span> • {new Date(comment.comment_created_at).toLocaleString()}
                  <p>{comment.comment_text}</p>
                </div>
              ))}
            </div>
          ) : (
            comments.slice(0, 3).map((comment) => (
              <div key={comment.comment_id} className="mt-2 text-sm text-gray-700">
                <span className="font-bold">{comment.comment_first_name} {comment.comment_last_name}</span> • {new Date(comment.comment_created_at).toLocaleString()}
                <p>{comment.comment_text}</p>
              </div>
            ))
          )}
          {comments.length > 3 && (
            <button
              onClick={() => setShowMoreComments(!showMoreComments)}
              className="text-amber-500 mt-2"
            >
              {showMoreComments ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
