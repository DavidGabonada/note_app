import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaSmile } from 'react-icons/fa';
import Post from './Post';

const Home = ({ userId: initialUserId, onLogout }) => {
  const [userId, setUserId] = useState(initialUserId || localStorage.getItem('userId'));
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [showFeelingOptions, setShowFeelingOptions] = useState(false);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      fetchPosts();
    }
  }, [userId]);

  const fetchPosts = () => {
    fetch('http://localhost/hugot/api.php')
      .then((response) => response.json())
      .then((data) => setPosts(data.posts))
      .catch((error) => console.error('Error fetching posts:', error));
  };

  const addPost = async () => {
    try {
      const response = await fetch('http://localhost/hugot/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addPost',
          user_id: userId,
          content: postText,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPosts([
          {
            post_id: result.post_id,
            user_id: result.user_id,
            first_name: result.first_name,
            last_name: result.last_name,
            content: postText,
            created_at: new Date().toISOString(),
            comments: [],
            likes: 0
          },
          ...posts,
        ]);
        setPostText('');
      } else {
        console.error('Failed to add post:', result.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const addComment = (postId, commentText) => {
    fetch('http://localhost/hugot/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'addComment',
        post_id: postId,
        user_id: userId,
        comment_text: commentText,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setPosts(
            posts.map((post) =>
              post.post_id === postId
                ? {
                    ...post,
                    comments: [
                      ...post.comments,
                      {
                        comment_id: data.comment_id,
                        comment_text: commentText,
                        created_at: new Date().toISOString(),
                        comment_first_name: data.comment_first_name,
                        comment_last_name: data.comment_last_name,
                      },
                    ],
                  }
                : post
            )
          );
        } else {
          console.error('Failed to add comment:', data.message);
        }
      });
  };

  const likePost = async (postId) => {
    try {
      const response = await fetch('http://localhost/hugot/api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'likePost',
          post_id: postId,
          user_id: userId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPosts(
          posts.map((post) =>
            post.post_id === postId
              ? {
                  ...post,
                  likes: post.likes + (data.liked ? 1 : -1),
                }
              : post
          )
        );
      } else {
        console.error('Failed to like post:', data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
    onLogout();
  };

  return (
    <div className="relative">
      <header className="w-full fixed top-0 left-0 flex justify-between items-center p-4 border-b border-gray-300 bg-gray-100 shadow-lg z-50">
        <div className="text-2xl font-bold text-blue-800 tracking-widest">
          Hugot App
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      <div className="pt-28 max-w-2xl mx-auto mt-10">
        <div className="mb-6 p-4 bg-gray-100 shadow-md rounded-lg border border-gray-300">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            rows="3"
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <FaSmile
              className="text-amber-500 text-2xl cursor-pointer hover:text-amber-600 transition"
              onClick={() => setShowFeelingOptions(!showFeelingOptions)}
            />
            <span
              className="ml-2 text-gray-600 cursor-pointer hover:text-gray-800 transition"
              onClick={() => setShowFeelingOptions(!showFeelingOptions)}
            >
              Feeling/activity
            </span>
          </div>

          {showFeelingOptions && (
            <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-200">
              <div className="grid grid-cols-2 gap-2">
                {['happy', 'loved', 'excited', 'blessed', 'sad', 'thankful'].map((feeling) => (
                  <div
                    key={feeling}
                    className="flex items-center cursor-pointer hover:bg-gray-300 p-2 rounded transition"
                    onClick={() => setPostText(`${postText} Feeling ${feeling}`)}
                  >
                    <img
                      src={`https://via.placeholder.com/20?text=${feeling.charAt(0).toUpperCase()}`}
                      alt={feeling}
                      className="mr-2"
                    />
                    <span>{feeling}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={addPost}
            className="mt-3 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition w-full"
          >
            Post
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post.post_id} post={post} addComment={addComment} likePost={likePost} user_id={userId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
