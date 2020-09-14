// CommentList.js
import React from "react"
import PropTypes from "prop-types"
import Comment from "./comment"

const CommentList = (props) => {
  const commentNodes = props.data.map((comment) => (
    <Comment
      author={comment.user_id.Email}
      key={comment._id}
      id={comment._id}
      Message={comment.Message}
      timestamp={comment.Created_At}
      handleDeleteComment={props.handleDeleteComment}
    >
      {comment.Message}
    </Comment>
  ))
  return <div>{commentNodes}</div>
}

CommentList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      author: PropTypes.string,
      id: PropTypes.string,
      text: PropTypes.string,
      updatedAt: PropTypes.string,
    })
  ),
  handleDeleteComment: PropTypes.func.isRequired,
}

CommentList.defaultProps = {
  data: [],
}

export default CommentList
