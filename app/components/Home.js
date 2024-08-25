"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaSmile, FaBars, FaTimes } from 'react-icons/fa';
import Post from './Post';
import { formatDistanceToNow } from 'date-fns';
import axios from 'axios';

const Home = ({ userId: initialUserId, onLogout }) => {
  const [userId, setUserId] = useState(initialUserId || localStorage.getItem('userId'));
  const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); // Retrieve userName
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [showFeelingOptions, setShowFeelingOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const getHugot = async () => {
    const url = 'http://localhost/hugot/get_hugot.php';
    const res = await axios.get(url);
    setPosts(res.data);
    console.log("res ni getHugot", res.data);
  };

  const addPost = async () => {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);
      formData.append("content", postText);
      const res = await axios.post('http://localhost/hugot/add_post.php', formData);
      console.log("res ni addpost", res.data);
      if (res.data === 1) {
        getHugot();
        setPostText('');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const addComment = async (postId, commentText) => {
    // Comment logic here
  };

  const likePost = async (postId, userId) => {
    // Like post logic here
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName'); // Clear userName on logout
    setUserId(null);
    setUserName(''); // Reset userName state
    onLogout();
  };

  useEffect(() => {
    getHugot();
  }, []);

  return (
    <div className="relative bg-gray-100 min-h-screen">
      <header className="w-full fixed top-0 left-0 flex justify-between items-center p-4 bg-blue-600 shadow-lg z-50">
        <div className="text-3xl font-extrabold text-white flex items-center">
          <span className="bg-white text-blue-600 px-3 py-2 rounded-full shadow-sm">HR</span>
          <span className="ml-2">Realization</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-white text-3xl focus:outline-none"
          >
            {showMenu ? <FaTimes /> : <FaBars />}
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <button
                onClick={handleLogout}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-300 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mt-24 p-8 max-w-3xl mx-auto space-y-8">
        <div className="p-6 bg-white rounded-2xl shadow-lg">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full p-4 bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-gray-800"
            placeholder={`Share your thoughts, ${userName}...`} // Display userName in placeholder
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setShowFeelingOptions(!showFeelingOptions)}
              className="text-gray-600 hover:text-blue-500 transition-all duration-300 flex items-center"
            >
              <FaSmile className="mr-2 text-xl" />
              <span className="font-medium">Feeling/activity</span>
            </button>
            <button
              onClick={addPost}
              className="bg-blue-500 text-white py-2 px-8 rounded-full hover:bg-blue-600 transition-all duration-300 shadow-lg"
            >
              Post
            </button>
          </div>
        </div>

        {posts && posts.map((post, index) => (
          <Post
            key={index}
            post={posts[index]}
            addComment={addComment}
            likePost={likePost}
            user_id={post.user_id}
            formatDistanceToNow={formatDistanceToNow}
          />
        ))}
      </main>
    </div>
  );
};

export default Home;