"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment } from 'react-icons/fa';

const Post = ({ post, addComment, likePost, user_id }) => {
  const {
    post_id,
    first_name,
    last_name,
    content,
    comments = [], // Ensure comments is always an array
    likes = 0,     // Ensure likes is a number
    created_at,
  } = post;

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showMoreComments, setShowMoreComments] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Fetch initial like status for this user
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`your_api_endpoint_to_get_like_status?post_id=${post_id}&user_id=${user_id}`);
        const data = await response.json();
        if (data.success) {
          setLiked(data.liked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [post_id, user_id]);

  const handleAddComment = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (commentText.trim()) {
        addComment(post_id, commentText);
        setCommentText('');
        setShowCommentInput(false);
      }
    }
  };

  const handleLikePost = async () => {
    try {
      const response = await likePost(post_id, user_id);
      if (response.success) {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleShowMoreComments = () => {
    setShowMoreComments(!showMoreComments);
  };

  const displayedComments = showMoreComments ? comments : comments.slice(0, 3);
  const isScrollable = comments.length > 3;

  return (
    <div className="mb-8 p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <div className="font-bold text-2xl text-gray-800">{`${first_name} ${last_name}`}</div>
      </div>
      <div className="text-gray-700 mb-4 text-lg">
        {content}
      </div>
      <div className="text-gray-500 text-sm mb-6">{new Date(created_at).toLocaleDateString()}</div>
      
      <div className="flex items-center mb-4 space-x-6">
        <button 
          className={`flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors duration-300 ${liked ? 'text-red-500' : ''}`}
          onClick={handleLikePost}
        >
          <FaHeart className="text-2xl" />
          <span className="font-medium">{likeCount}</span>
        </button>
        <button 
          className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors duration-300"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          <FaComment className="text-2xl" />
          <span className="font-medium">Comment</span>
        </button>
      </div>

      {showCommentInput && (
        <div className="mb-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={handleAddComment}
          />
        </div>
      )}

      <div className={`space-y-4 ${isScrollable ? 'max-h-48 overflow-y-auto scrollbar-hide' : ''}`}>
        {displayedComments.map((comment) => (
          <div key={comment.comment_id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="font-semibold text-blue-600 mb-2">
              {comment.comment_first_name} {comment.comment_last_name}
            </div>
            <div className="text-gray-700">{comment.comment_text}</div>
            <div className="text-gray-400 text-xs mt-1">{new Date(comment.created_at).toLocaleDateString()}</div>
          </div>
        ))}
        {comments.length > 3 && (
          <button
            onClick={handleShowMoreComments}
            className="text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium"
          >
            {showMoreComments ? 'Show less' : 'View more comments'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Post;
