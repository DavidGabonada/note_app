"use client";
import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaSmile } from 'react-icons/fa';
import Post from './Post';
import { formatDistanceToNow } from 'date-fns';
import { TextSelect } from 'lucide-react';
import { Form } from 'react-bootstrap';

const Home = ({ userId: initialUserId, onLogout }) => {
  const [userId, setUserId] = useState(initialUserId || localStorage.getItem('userId'));
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState('');
  const [showFeelingOptions, setShowFeelingOptions] = useState(false);
  const [category_Id, setCategory_Id] = useState("");

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      fetchPosts();
    }
  }, [userId]);

  useEffect(() => {
    console.log("category_Id",category_Id)
  },[category_Id])

  const fetchPosts = () => {
    fetch('http://localhost/hugot/api.php?action=getPosts')
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
          category_Id: category_Id,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setPosts([
          {
            post_id: result.post_id,
            user_id: result.user_id,
            post_first_name: result.first_name,
            post_last_name: result.last_name,
            post_content: postText,
            post_created_at: new Date().toISOString(),
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
                        comment_created_at: new Date().toISOString(),
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
      <header className="w-full fixed top-0 left-0 flex justify-between items-center p-4 border-b border-gray-300 bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg z-50">
        <div className="text-2xl font-bold text-white tracking-widest">
          <span className="bg-white text-blue-500 px-2 py-1 rounded-lg">Hugot</span>
          <span className="ml-2">Realization</span>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>
      <div className="mt-20 p-6 max-w-3xl mx-auto space-y-6">
        <div className="p-6 bg-white shadow rounded-lg border border-gray-300">
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            placeholder="What's on your mind?"
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setShowFeelingOptions(!showFeelingOptions)}
              className="text-gray-500 hover:text-gray-800 transition flex items-center"
            >
              <FaSmile className="mr-2" />
              <span>Feeling/activity</span>
              <Form.Select onChange = {(e => setCategory_Id(e.target.value))}>
                <option>Select Category</option>
                <option value="1">Love</option>
                <option value="2">Work</option>
                <option value="3">Life</option>
              </Form.Select>
            </button>
            <button
              onClick={addPost}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Post
            </button>
          </div>
        </div>

        {posts.map((post) => (
          <Post
            key={post.post_id}
            post={post}
            addComment={addComment}
            likePost={likePost}
            user_id={userId}
            formatDistanceToNow={formatDistanceToNow}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
