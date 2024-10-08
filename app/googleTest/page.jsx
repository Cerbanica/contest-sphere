"use client"
import React, { useState } from 'react';

const page = () => {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage('Please select an image to upload.');
      return;
    }

    setUploading(true);

    // Get the signed URL from your server
    const res = await fetch('/generate-signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: image.name,
        fileType: image.type,
      }),
    });

    const { url } = await res.json();

    // Upload the image using the signed URL
    const uploadRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });

    if (uploadRes.ok) {
      setMessage('Image uploaded successfully!');
    } else {
      setMessage('Image upload failed.');
    }

    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Upload Image</h2>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border border-gray-300 p-2 w-full"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        {message && (
          <div className="mt-4 text-center text-gray-600">{message}</div>
        )}
      </div>
    </div>
  );
}

export default page;
