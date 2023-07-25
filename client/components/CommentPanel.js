/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState } from "react";
import {
  FaceSmileIcon as FaceSmileIconOutline,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Listbox, Transition } from "@headlessui/react";
import {
  FaceFrownIcon,
  FaceSmileIcon as FaceSmileIconMini,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/20/solid";

const CommentPanel = ({ onCommentCancel, onCommentSubmit }) => {
  const [reviewContent, setReviewContent] = useState("");

  const handleContentChange = (e) => {
    setReviewContent(e.target.value);
  };

  const onCancelClick = (e) => {
    e.preventDefault();
    onCommentCancel();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    onCommentSubmit(reviewContent);
  };

  return (
    <div className="flex items-start space-x-4 mt-4 mb-12">
      <div className="flex-shrink-0">
        <UserCircleIcon
          className="inline-block h-10 w-10 rounded-full text-orange-600"
          // src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          // alt=""
        />
      </div>
      <div className="min-w-0 flex-1">
        <form onSubmit={onCommentSubmit}>
          <div className="border-b border-gray-200 focus-within:border-orange-600">
            <textarea
              value={reviewContent}
              onChange={handleContentChange}
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-600 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder=" Write down your comments on this recipe here. Please be polite and respectful."
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5"></div>
            <div className="flex-shrink-0">
              <button
                className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 mx-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                onClick={onCancelClick}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                onClick={handleCommentSubmit}
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentPanel;
