// ReplyList.js
import React from "react"
import PropTypes from "prop-types"
import Reply from "./reply"

const ReplyList = (props) => {
  const commentNodes = props.data.map((comment) => (
    <Reply
      author={comment.user_id.Email}
      key={comment._id}
      id={comment._id}
      Message={comment.Message}
      timestamp={comment.Created_At}
      handleDeleteComment={props.handleDeleteComment}
    >
      {comment.Message}
    </Reply>
  ))
  return <div>{commentNodes}</div>
}

ReplyList.propTypes = {
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

ReplyList.defaultProps = {
  data: [],
}

export default ReplyList
